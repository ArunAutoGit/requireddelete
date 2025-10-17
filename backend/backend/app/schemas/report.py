# app/schemas/printer_report.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrinterReportResponse(BaseModel):
    s_no: int
    reference_batch_id: int
    user_id: Optional[int]
    part_name: Optional[str]
    batch_quantity: int
    printed_on: Optional[datetime]

    class Config:
        from_attributes = True
        
class CouponReportResponse(BaseModel):
    s_no: int
    unique_batch_id: int
    coupon_unique_number: str
    part_number: Optional[str]
    amount: Optional[float]

    class Config:
        from_attributes = True