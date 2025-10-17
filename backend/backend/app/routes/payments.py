from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies.auth import get_current_active_user, require_role
from app.schemas.payment import PaymentProfileResponse
from app.model.usermaster import UserMaster
from app.schemas.user import UserRole
from app.crud.payment import get_payment_profile, get_users_eligible_for_payment_creation, update_payment_profile
from app.services.razorpay_service import razorpay_service
from app.services import payment_creation_service

router = APIRouter(prefix="/payments", tags=["payments"])

@router.get("/profiles/{user_id}", response_model=PaymentProfileResponse)
async def get_user_payment_profile(
    user_id: int,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payment_profile = get_payment_profile(db, user_id)
    if not payment_profile:
        raise HTTPException(status_code=404, detail="Payment profile not found")
    
    return payment_profile

@router.post("/create-pending", response_model=List[dict])
async def create_pending_payment_profiles(
    background_tasks: BackgroundTasks,
    current_user: UserMaster = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create payment profiles for all eligible users (admin only)"""
    eligible_users = get_users_eligible_for_payment_creation(db)
    
    results = []
    for user in eligible_users:
        background_tasks.add_task(
            payment_creation_service.create_user_payment_profile,
            db, user
        )
        results.append({"user_id": user.user_id, "name": user.name, "status": "queued"})
    
    return results

@router.post("/verify/{user_id}")
async def verify_payment_profile(
    user_id: int,
    current_user: UserMaster = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Manually trigger verification for a specific user"""
    payment_profile = get_payment_profile(db, user_id)
    if not payment_profile:
        raise HTTPException(status_code=404, detail="Payment profile not found")
    
    # Verify contact status
    if payment_profile.razorpay_contact_id:
        contact_status = await razorpay_service.get_contact_status(payment_profile.razorpay_contact_id)
        if contact_status and contact_status.get('active'):
            update_payment_profile(db, user_id, verification_status='verified')
            return {"status": "verified", "message": "Contact verified successfully"}
    
    # Verify fund account status
    if payment_profile.razorpay_fund_account_id:
        fund_account_status = await razorpay_service.get_fund_account_status(payment_profile.razorpay_fund_account_id)
        if fund_account_status and fund_account_status.get('active'):
            update_payment_profile(db, user_id, verification_status='verified')
            return {"status": "verified", "message": "Fund account verified successfully"}
    
    return {"status": "pending", "message": "Still pending verification"}