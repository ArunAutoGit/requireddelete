from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, ForeignKey
from sqlalchemy.orm import relationship

class UserPaymentProfile(Base):
    __tablename__ = "user_payment_profiles"

    user_id = Column(Integer, ForeignKey("usermaster.user_id"), primary_key=True)
    razorpay_contact_id = Column(String(100), nullable=True)
    razorpay_fund_account_id = Column(String(100), nullable=True)
    verification_status = Column(String(20), default='pending')  # pending, verified, failed
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("UserMaster", back_populates="payment_profile")