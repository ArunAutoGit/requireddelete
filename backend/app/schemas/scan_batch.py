from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ScanBatchSummary(BaseModel):
    scan_batch_id: int
    total_coupons: int
    validated_count: int
    failed_count: int
    scanned_by: str
    scanned_on: datetime
    status: str

    class Config:
        orm_mode = True

class ScanBatchDetail(BaseModel):
    coupon_id: int
    unique_num: str
    batch_id: int
    product_name: str
    status: str
    scanned_at: datetime

    class Config:
        orm_mode = True

class ScanBatchResponse(BaseModel):
    summary: ScanBatchSummary
    coupons: List[ScanBatchDetail]