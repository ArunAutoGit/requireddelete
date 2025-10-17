# app/models/draft_session.py
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON, Boolean, Numeric, Text
from sqlalchemy.sql import func
from app.core.database import Base

class DraftSession(Base):
    __tablename__ = "draft_sessions"
    
    draft_session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  
    mechanic_id = Column(Integer, nullable=False) 
    mechanic_address = Column(String, nullable=True)  
    scanned_coupons = Column(JSON, default=[])  
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # New fields for location tracking
    scan_latitude = Column(Numeric(10, 8), nullable=True)  
    scan_longitude = Column(Numeric(11, 8), nullable=True) 
    scan_address = Column(Text, nullable=True)  
    location_verified = Column(Boolean, default=False) 
    scan_timestamp = Column(TIMESTAMP, server_default=func.now()) 