from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from app.core.database import Base

class ScanSessionDetails(Base):
    __tablename__ = "scansessiondetails"

    detail_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("scansession.session_id"))
    coupon_id = Column(Integer, ForeignKey("couponlabel.coupon_id"))
    validation_status = Column(String(50))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
