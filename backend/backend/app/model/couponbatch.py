from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, ForeignKey
from app.core.database import Base

class CouponBatch(Base):
    __tablename__ = "couponbatch"

    batch_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("productmaster.product_id"))
    quantity = Column(Integer)
    coupon_value = Column(Numeric(10, 2))
    qr_prefix = Column(String(20))
    printed_by = Column(Integer)
    printed_date = Column(TIMESTAMP)
    total_cost = Column(Numeric(12, 2))
    status = Column(String(50))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
