from sqlalchemy.orm import Session
from typing import Optional
from app.model.user_payment import UserPaymentProfile
from app.model.usermaster import UserMaster

def create_payment_profile(db: Session, user_id: int) -> UserPaymentProfile:
    db_payment = UserPaymentProfile(user_id=user_id)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payment_profile(db: Session, user_id: int) -> Optional[UserPaymentProfile]:
    return db.query(UserPaymentProfile).filter(UserPaymentProfile.user_id == user_id).first()

def update_payment_profile(
    db: Session, 
    user_id: int, 
    razorpay_contact_id: Optional[str] = None,
    razorpay_fund_account_id: Optional[str] = None,
    verification_status: Optional[str] = None
) -> Optional[UserPaymentProfile]:
    db_payment = get_payment_profile(db, user_id)
    if db_payment:
        if razorpay_contact_id:
            db_payment.razorpay_contact_id = razorpay_contact_id
        if razorpay_fund_account_id:
            db_payment.razorpay_fund_account_id = razorpay_fund_account_id
        if verification_status:
            db_payment.verification_status = verification_status
        db.commit()
        db.refresh(db_payment)
    return db_payment

def get_users_eligible_for_payment_creation(db: Session) -> list[UserMaster]:
    """Get users who need payment profile creation (approved MSR, StateHead, ZonalHead)"""
    return db.query(UserMaster).filter(
        UserMaster.role.in_(['msr', 'statehead', 'zonalhead']),
        UserMaster.onboarding_status == 'approved',
        UserMaster.user_id.notin_(
            db.query(UserPaymentProfile.user_id)
        )
    ).all()