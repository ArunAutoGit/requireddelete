from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usermaster.user_id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    purpose = Column(Text, nullable=False)
    status = Column(String(20), default="pending")  # pending, processing, processed, failed, reversed
    razorpay_payout_id = Column(String(100), nullable=True)
    failure_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("UserMaster", back_populates="payouts")