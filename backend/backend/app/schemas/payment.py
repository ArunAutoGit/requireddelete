from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class ContactType(str, Enum):
    CUSTOMER = "customer"
    VENDOR = "vendor"
    SELF = "self"

class AccountType(str, Enum):
    BANK_ACCOUNT = "bank_account"
    VPA = "vpa"

class ContactCreate(BaseModel):
    name: str
    email: Optional[str] = None
    contact: Optional[str] = None
    type: ContactType = ContactType.VENDOR
    reference_id: Optional[str] = None
    notes: Optional[dict] = None

class BankAccountDetails(BaseModel):
    name: str
    ifsc: str
    account_number: str

class VpaDetails(BaseModel):
    address: str

class FundAccountCreate(BaseModel):
    contact_id: str
    account_type: AccountType
    bank_account: Optional[dict] = None
    vpa: Optional[dict] = None
    
    def dict(self, **kwargs):
        # Override to ensure proper serialization
        data = super().dict(**kwargs)
        
        # Convert enum to string
        if 'account_type' in data and isinstance(data['account_type'], AccountType):
            data['account_type'] = data['account_type'].value
        
        # Remove None values completely
        if data.get('bank_account') is None:
            data.pop('bank_account', None)
        if data.get('vpa') is None:
            data.pop('vpa', None)
            
        return data

class PaymentProfileResponse(BaseModel):
    user_id: int
    vpa_id: Optional[str] = None
    razorpay_contact_id: Optional[str] = None
    razorpay_fund_account_id: Optional[str] = None
    verification_status: str

    class Config:
        from_attributes = True