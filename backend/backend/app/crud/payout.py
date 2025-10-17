from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.model.payout import Payout
from app.schemas.payout import PayoutStatus

def create_payout(db: Session, payout_data: dict) -> Payout:
    db_payout = Payout(**payout_data)
    db.add(db_payout)
    db.commit()
    db.refresh(db_payout)
    return db_payout

def get_payout(db: Session, payout_id: int) -> Optional[Payout]:
    return db.query(Payout).filter(Payout.id == payout_id).first()

def get_payout_by_razorpay_id(db: Session, razorpay_payout_id: str) -> Optional[Payout]:
    return db.query(Payout).filter(Payout.razorpay_payout_id == razorpay_payout_id).first()

def get_payouts_by_user(db: Session, user_id: int) -> List[Payout]:
    return db.query(Payout).filter(Payout.user_id == user_id).all()

def get_payouts_by_status(db: Session, status: PayoutStatus) -> List[Payout]:
    return db.query(Payout).filter(Payout.status == status).all()

def update_payout_status(
    db: Session, 
    payout_id: int, 
    status: PayoutStatus,
    razorpay_payout_id: Optional[str] = None,
    failure_reason: Optional[str] = None
) -> Optional[Payout]:
    db_payout = get_payout(db, payout_id)
    if db_payout:
        db_payout.status = status
        if razorpay_payout_id:
            db_payout.razorpay_payout_id = razorpay_payout_id
        if failure_reason:
            db_payout.failure_reason = failure_reason
        if status == PayoutStatus.PROCESSED:
            db_payout.processed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_payout)
    return db_payout