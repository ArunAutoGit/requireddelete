from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class MSRVisit(BaseModel):
    # Visit Identifiers
    visit_id: int
    visit_datetime: datetime
    
    # Payment Information
    coupon_amount: float
    
    # Scanner Information (The MSR/Statehead/Zonalhead)
    msr_id: int
    msr_name: str
    msr_role: str
    
    # Mechanic Information (The Visited Entity)
    mechanic_id: int
    mechanic_name: str
    scheduled_lat: Optional[float] = None
    scheduled_lng: Optional[float] = None
    
    # Actual Scanned Location
    scanned_lat: Optional[float] = None
    scanned_lng: Optional[float] = None
    scanned_address: Optional[str] = None
    
    # Location Verification Result
    location_mismatch: bool

    class Config:
        from_attributes = True
        
class MSRVisitGrouped(BaseModel):
    # Unique identifier for this visit event
    scan_batch_id: int
    visit_datetime: datetime
    
    # Scanner Information
    msr_id: int
    msr_name: str
    msr_role: str
    
    # Mechanic Information
    mechanic_id: int
    mechanic_name: str
    scheduled_lat: Optional[float] = None
    scheduled_lng: Optional[float] = None
    
    # Scanned Location (This will be the same for all coupons in the batch)
    scanned_lat: Optional[float] = None
    scanned_lng: Optional[float] = None
    scanned_address: Optional[str] = None
    
    # Visit Summary
    location_mismatch: bool
    total_coupons: int  # Count of coupons scanned in this batch for this mechanic
    total_amount: float # Sum of coupon_value for all coupons in this batch

    class Config:
        from_attributes = True
        
