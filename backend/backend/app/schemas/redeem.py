from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CouponScanRequest(BaseModel):
    token: str
    draft_session_id: int

class CouponScanResponse(BaseModel):
    coupon_id: int
    unique_num: str
    batch_id: int
    product_name: str
    part_no: str
    grade: str
    size: str
    cell: str
    coupon_value: float
    status: str
    is_valid: bool
    error_message: Optional[str] = None
    draft_updated: bool = False

class BatchValidationRequest(BaseModel):
    draft_session_id: int

class BatchValidationResponse(BaseModel):
    success: bool
    message: str
    validated_count: int
    failed_count: int
    failed_coupons: List[dict]
    draft_session_id: int
    scan_batch_id: int
    total_cost: float
    
class CouponScanByUniqueNumberRequest(BaseModel):
    unique_number: str
    draft_session_id: int
    
    class Config:
        from_attributes = True