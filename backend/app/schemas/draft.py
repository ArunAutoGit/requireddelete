from pydantic import BaseModel, Field
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class DraftSessionCreate(BaseModel):
    user_id: int
    mechanic_id: int
    mechanic_address: Optional[str] = None
    scan_latitude: Optional[float] = None
    scan_longitude: Optional[float] = None

    class Config:
        from_attributes = True
        
class DraftSessionUpdate(BaseModel):
    scanned_coupons: List[str]  # List of unique_nums

class DraftSessionOut(BaseModel):
    draft_session_id: int
    user_id: int
    mechanic_id: int
    mechanic_address: Optional[str]
    scanned_coupons: List[str]
    scanned_count: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        orm_mode = True

class DraftSessionResponse(BaseModel):
    success: bool
    draft_session_id: int
    message: str

class DraftSessionExistsResponse(BaseModel):
    success: bool
    draft_session_id: int
    message: str
    exists: bool