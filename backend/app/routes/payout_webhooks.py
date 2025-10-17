from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.razorpay_service import razorpay_service
from app.crud.payout import update_payout_status, get_payout_by_razorpay_id
from app.schemas.payout import PayoutStatus

router = APIRouter(prefix="/webhooks/payouts", tags=["webhooks"])

@router.post("/razorpay")
async def handle_razorpay_payout_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get('X-Razorpay-Signature')
    
    if not await razorpay_service.validate_webhook_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    webhook_data = await request.json()
    event = webhook_data.get('event')
    payload_data = webhook_data.get('payload', {}).get('payout', {})
    
    razorpay_payout_id = payload_data.get('id')
    if not razorpay_payout_id:
        return {"status": "ignored", "message": "No payout ID in webhook"}
    
    # Find the payout in our database
    payout = get_payout_by_razorpay_id(db, razorpay_payout_id)
    if not payout:
        return {"status": "ignored", "message": "Payout not found in database"}
    
    # Handle different webhook events
    if event == 'payout.processed':
        update_payout_status(db, payout.id, PayoutStatus.PROCESSED)
    
    elif event == 'payout.failed':
        failure_reason = payload_data.get('failure_reason', 'Unknown error')
        update_payout_status(db, payout.id, PayoutStatus.FAILED, failure_reason=failure_reason)
    
    elif event == 'payout.reversed':
        update_payout_status(db, payout.id, PayoutStatus.REVERSED)
    
    return {"status": "processed"}