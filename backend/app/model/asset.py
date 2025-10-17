# app/models/asset.py
from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(Integer, primary_key=True, index=True)
    asset_name = Column(String(150), nullable=False)
    asset_type = Column(String(50), nullable=False)  # laptop, mobile, etc.
    asset_serial_number = Column(String(100), unique=True, nullable=True)
    asset_model = Column(String(100), nullable=True)
    asset_specifications = Column(Text, nullable=True)
    
    # Assignment details
    assigned_to = Column(Integer, ForeignKey("usermaster.user_id"), nullable=True)
    assigned_location = Column(String(150), nullable=True)
    allocated_on = Column(DateTime, default=datetime.utcnow, nullable=True)
    
    # Status
    status = Column(String(20), default="available")  # available, allocated, maintenance, retired
    
    # Timestamps
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Simplified audit fields (store user IDs without relationships)
    created_by = Column(Integer, nullable=True)  # Just store the user ID
    updated_by = Column(Integer, nullable=True)  # Just store the user ID
    
    # Only keep the essential relationship for assigned user
    user = relationship("UserMaster", foreign_keys=[assigned_to])