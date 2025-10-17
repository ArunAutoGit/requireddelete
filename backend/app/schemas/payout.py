from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class PayoutStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    REVERSED = "reversed"

class PayoutMethod(str, Enum):
    BANK_ACCOUNT = "bank_account"
    VPA = "vpa"

class PayoutCreate(BaseModel):
    user_id: int
    amount: float = Field(..., gt=0, description="Amount in INR")
    currency: str = "INR"
    purpose: str = Field(..., description="Purpose of payout")
    notes: Optional[dict] = None

class PayoutResponse(BaseModel):
    payout_id: str
    user_id: int
    amount: float
    currency: str
    purpose: str
    status: PayoutStatus
    razorpay_payout_id: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True