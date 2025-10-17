from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.dependencies.auth import get_current_active_user, require_role
from app.model.payout import Payout
from app.schemas.payout import PayoutCreate, PayoutResponse, PayoutStatus
from app.model.usermaster import UserMaster
from app.schemas.user import UserRole
from app.crud.payout import create_payout, get_payouts_by_user, get_payout, update_payout_status
from app.crud.payment import get_payment_profile
from app.services.payout_service import payout_service
from app.crud.user import get_user

router = APIRouter(prefix="/payouts", tags=["payouts"])

@router.post("/", response_model=PayoutResponse)
async def create_new_payout(
    payout_data: PayoutCreate,
    background_tasks: BackgroundTasks,
    current_user: UserMaster = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new payout (admin only)"""
    # Get the user to payout to
    user = get_user(db, payout_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is eligible for payout (has verified payment profile)
    payment_profile = get_payment_profile(db, user.user_id)
    if not payment_profile or payment_profile.verification_status != 'verified':
        raise HTTPException(status_code=400, detail="User does not have a verified payment profile")
    
    # Create payout record
    db_payout = create_payout(db, {
        "user_id": payout_data.user_id,
        "amount": payout_data.amount,
        "currency": payout_data.currency,
        "purpose": payout_data.purpose,
        "notes": str(payout_data.notes) if payout_data.notes else None
    })
    
    # Process payout with Razorpay (in background)
    background_tasks.add_task(
        process_payout_background,
        db, db_payout.id, payout_data, user
    )
    
    return db_payout

@router.get("/user/{user_id}", response_model=List[PayoutResponse])
async def get_user_payouts(
    user_id: int,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get payouts for a specific user"""
    if current_user.role != UserRole.ADMIN and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return get_payouts_by_user(db, user_id)

@router.get("/{payout_id}", response_model=PayoutResponse)
async def get_payout_details(
    payout_id: int,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific payout"""
    payout = get_payout(db, payout_id)
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    if current_user.role != UserRole.ADMIN and current_user.user_id != payout.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return payout

# Add this function to get payout by razorpay ID (needed for webhook)
def get_payout_by_razorpay_id(db: Session, razorpay_payout_id: str):
    return db.query(Payout).filter(Payout.razorpay_payout_id == razorpay_payout_id).first()

async def process_payout_background(db: Session, payout_id: int, payout_data: PayoutCreate, user: UserMaster):
    """Background task to process payout with Razorpay"""
    try:
        # Process with Razorpay
        razorpay_response = await payout_service.create_payout(payout_data, user)
        
        if razorpay_response and razorpay_response.get('id'):
            # Update with Razorpay payout ID
            update_payout_status(
                db, payout_id, 
                status=PayoutStatus.PROCESSING,
                razorpay_payout_id=razorpay_response['id']
            )
        else:
            # Mark as failed if Razorpay call failed
            update_payout_status(
                db, payout_id, 
                status=PayoutStatus.FAILED,
                failure_reason="Razorpay API call failed"
            )
            
    except Exception as e:
        update_payout_status(
            db, payout_id, 
            status=PayoutStatus.FAILED,
            failure_reason=str(e)
        )