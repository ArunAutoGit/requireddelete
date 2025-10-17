from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ProductMasterBase(BaseModel):
    sl_no: Optional[int] = Field(None, description="Auto-generated if not provided")
    location: Optional[str] = None
    cell: Optional[str] = None
    vehicle_application: Optional[str] = None
    segment_product: Optional[str] = None
    product_name: Optional[str] = None
    part_no: Optional[str] = None
    grade: Optional[str] = None
    size: Optional[str] = None
    net_qty_inner: Optional[int] = None
    net_qty_master: Optional[int] = None
    size1: Optional[str] = None
    mechanic_coupon_inner: Optional[float] = None
    mrp_inner: Optional[float] = None
    mrp_master: Optional[float] = None
    barcode: Optional[str] = None
    prd_code: Optional[str] = None
    padi_cell: Optional[str] = None
    tskp1_cell: Optional[str] = None
    tskp2_cell: Optional[str] = None
    lbl_status: Optional[bool] = False

class ProductMasterCreate(ProductMasterBase):
    pass

class ProductMasterUpdate(ProductMasterBase):
    pass

class ProductMasterOut(ProductMasterBase):
    product_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[int]
    updated_by: Optional[int]

    class Config:
        orm_mode = True