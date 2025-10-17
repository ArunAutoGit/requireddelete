# app/models/usermaster.py
from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Text, ForeignKey, Float
from sqlalchemy.orm import relationship

class UserMaster(Base):
    __tablename__ = "usermaster"

    user_id = Column(Integer, primary_key=True, index=True)
    t_no = Column(String(50), nullable=True)
    name = Column(String(150), nullable=False)
    designation = Column(String(100), nullable=True)
    hq = Column(String(150), nullable=True)
    responsibility = Column(String(150), nullable=True)
    role = Column(String(50), nullable=False)
    
    # Keep the ForeignKey
    reports_to = Column(Integer, nullable=True)
    
    status = Column(Boolean, default=False)
    
    # Contact Information
    email = Column(String(150), unique=True, index=True, nullable=True)
    mobile = Column(String(15), unique=True, index=True, nullable=True)
    
    # Address fields
    address_line1 = Column(Text, nullable=False)
    address_line2 = Column(Text, nullable=False)
    state = Column(Text, nullable=False)
    district = Column(Text, nullable=False)
    pincode = Column(String(6), nullable=False)

    # Location for printers (plant location)
    location = Column(String(150), nullable=True)
    
    # Geolocation for mechanics (latitude and longitude)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    company_name = Column(String(150), nullable=True)
    
    # Bank details for specific roles
    bank_account_holder = Column(String(150), nullable=True)
    bank_name = Column(String(100), nullable=True)
    bank_account_number = Column(String(50), nullable=True)
    bank_ifsc_code = Column(String(20), nullable=True)
    vpa_id = Column(String(100), nullable=True)
    onboarding_status = Column(String(20), default='pending')  
    rejection_reason = Column(Text, nullable=True)

    # Authentication
    password_hash = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Audit fields
    created_by = Column(Integer, nullable=True)
    updated_by = Column(Integer, nullable=True)
    
    # Correct relationship definition
    onboarder = relationship(
        "UserMaster", 
        primaryjoin="UserMaster.reports_to == foreign(UserMaster.user_id)",
        foreign_keys="[UserMaster.reports_to]",
        remote_side="[UserMaster.user_id]",
        viewonly=True
    )
    
    payment_profile = relationship("UserPaymentProfile", back_populates="user", uselist=False)
    payouts = relationship("Payout", back_populates="user")
