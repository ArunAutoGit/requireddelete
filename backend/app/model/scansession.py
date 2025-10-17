from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, Text, ForeignKey
from app.core.database import Base

class ScanSession(Base):
    __tablename__ = "scansession"

    session_id = Column(Integer, primary_key=True, index=True)
    msr_id = Column(Integer)
    entity_id = Column(Integer, ForeignKey("entitymaster.entity_id"))
    location_lat = Column(Numeric(10, 6))
    location_long = Column(Numeric(10, 6))
    total_coupons = Column(Integer)
    valid_coupons = Column(Integer)
    total_amount = Column(Numeric(10, 2))
    payment_screenshot_url = Column(Text)
    status = Column(String(50))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
