from sqlalchemy import Column, Integer, String, Boolean, Numeric, TIMESTAMP
from app.core.database import Base

class ProductMaster(Base):
    __tablename__ = "productmaster"

    product_id = Column(Integer, primary_key=True, index=True)
    sl_no = Column(Integer)
    location = Column(String(100))
    cell = Column(String(50))
    vehicle_application = Column(String(150))
    segment_product = Column(String(100))
    product_name = Column(String(150))
    part_no = Column(String(50))
    grade = Column(String(50))
    size = Column(String(50))
    net_qty_inner = Column(Integer)
    net_qty_master = Column(Integer)
    size1 = Column(String(50))
    mechanic_coupon_inner = Column(Numeric(10, 2))
    mrp_inner = Column(Numeric(10, 2))
    mrp_master = Column(Numeric(10, 2))
    barcode = Column(String(50))
    prd_code = Column(String(50))
    padi_cell = Column(String(50))
    tskp1_cell = Column(String(50))
    tskp2_cell = Column(String(50))
    lbl_status = Column(Boolean)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
