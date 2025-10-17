# app/models/couponlabel.py
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Numeric, Text, Boolean
from app.core.database import Base

class CouponLabel(Base):
    __tablename__ = "couponlabel"

    coupon_id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("couponbatch.batch_id"))
    qr_code = Column(String(255))
    unique_num = Column(String(50))
    status = Column(String(50))
    scanned_by = Column(Integer)
    scanned_on = Column(TIMESTAMP)
    entity_id = Column(Integer, ForeignKey("entitymaster.entity_id"))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
    scan_batch_id = Column(Integer, nullable=True)  
    
    # New fields for location audit trail
    scan_latitude = Column(Numeric(10, 8), nullable=True) 
    scan_longitude = Column(Numeric(11, 8), nullable=True)  
    scan_address = Column(Text, nullable=True)  
    location_verified = Column(Boolean, default=False)  
    mechanic_id_at_scan = Column(Integer, nullable=True)  