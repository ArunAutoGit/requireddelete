from typing import List, Optional
from pydantic import BaseModel, validator
from datetime import datetime

class CouponBatchCreate(BaseModel):
    product_id: int
    quantity: int

    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be greater than 0')
        if v > 999:
            raise ValueError('Quantity cannot exceed 999')
        return v

class CouponBatchOut(BaseModel):
    batch_id: int
    product_id: int
    quantity: int
    coupon_value: float  # Now taken from product
    qr_prefix: Optional[str] = None
    total_cost: float
    status: str
    created_at: datetime
    created_by: Optional[int] = None

    class Config:
        orm_mode = True

class CouponLabelOut(BaseModel):
    coupon_id: int
    batch_id: int
    qr_code: str
    unique_num: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
        
class ProductPrintData(BaseModel):
    product_name: Optional[str] = None
    part_no: Optional[str] = None
    grade: Optional[str] = None
    net_qty_inner: Optional[int] = None
    size1: Optional[str] = None
    pkd_date: Optional[str] = None  # Format: "JUL 2025"
    mrp_inner: Optional[float] = None
    mechanic_coupon_inner: Optional[float] = None

class QRCodePrintData(BaseModel):
    coupon_id: int
    unique_num: str
    qr_code_base64: str  # Frontend will convert to image
    status: str

class BatchPrintResponse(BaseModel):
    batch_id: int
    product: ProductPrintData
    qr_codes: List[QRCodePrintData]
    total_quantity: int
    generated_at: datetime

    class Config:
        orm_mode = True
        
class CouponBatchWithProductOut(CouponBatchOut):
    product_details: Optional[dict] = None

    class Config:
        orm_mode = True

