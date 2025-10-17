# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from datetime import datetime
from typing import Optional, Union, Any, Dict, List
from enum import Enum

class UserRole(str, Enum):
    MECHANIC = "mechanic"
    MSR = "msr"
    ADMIN = "admin"
    PRINTER = "printer"
    STATEHEAD = "statehead"
    ZONALHEAD = "zonalhead"
    FINANCE = "finance"
    DEALER = "dealer"
    STOCKIST = "stockist"

class OnboardingStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class UserBase(BaseModel):
    t_no: Optional[str] = None
    name: str = Field(..., min_length=1)
    designation: Optional[str] = None
    hq: Optional[str] = None
    responsibility: Optional[str] = None
    role: UserRole
    reports_to: Optional[int] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    
    # Address fields - make them optional in base
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = Field(None, min_length=6, max_length=6)
    
    # Location for printers (plant location)
    location: Optional[str] = None
    
    # Geolocation for mechanics (latitude and longitude)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    company_name: Optional[str] = None
    
    # Bank details
    bank_account_holder: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    vpa_id: Optional[str] = None
    onboarding_status: Optional[OnboardingStatus] = None
    rejection_reason: Optional[str] = None
    
    # Convert t_no to string if it's numeric
    @field_validator('t_no', mode='before')
    def convert_t_no_to_string(cls, v):
        if v is not None:
            return str(v)
        return v
    
    # Validate latitude and longitude
    @field_validator('latitude', 'longitude')
    def validate_coordinates(cls, v, info):
        if v is not None:
            field_name = info.field_name
            if field_name == 'latitude' and not (-90 <= v <= 90):
                raise ValueError('Latitude must be between -90 and 90')
            if field_name == 'longitude' and not (-180 <= v <= 180):
                raise ValueError('Longitude must be between -180 and 180')
        return v

class UserCreate(UserBase):
    password: Optional[str] = Field(None, min_length=6)
    
    @model_validator(mode='after')
    def validate_required_fields(cls, values):
        role = values.role
        
        # Roles that don't need email/password (non-login roles)
        non_login_roles = [UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST]
        login_roles = [UserRole.ADMIN, UserRole.FINANCE, UserRole.PRINTER, 
                      UserRole.MSR, UserRole.STATEHEAD, UserRole.ZONALHEAD]
        
        # For login roles, email and password are required
        if role in login_roles:
            if not values.email:
                raise ValueError("email is required for this role")
            if not values.password:
                raise ValueError("password is required for this role")
        
        # For non-login roles, email and password should NOT be provided
        if role in non_login_roles:
            if values.email:
                raise ValueError("email should not be provided for non-login roles")
            if values.password:
                raise ValueError("password should not be provided for non-login roles")
        
        # Address validation for all roles
        address_fields = ['address_line1', 'state', 'district', 'pincode']
        for field in address_fields:
            if not getattr(values, field):
                raise ValueError(f"{field} is required")
        
        # For mechanic, dealer, stockist - company_name is required
        roles_requiring_company = [UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST]
        if role in roles_requiring_company and not values.company_name:
            raise ValueError("company_name is required for mechanic, dealer, and stockist roles")
        
        # Location validation for printers
        if role == UserRole.PRINTER and not values.location:
            raise ValueError("location is required for printer role")
        
        # Geolocation validation for mechanics
        if role == UserRole.MECHANIC:
            if values.latitude is None or values.longitude is None:
                raise ValueError("latitude and longitude are required for mechanic role")
        
        # Bank details OR VPA validation for specific roles
        roles_requiring_payment = [UserRole.MSR, UserRole.STATEHEAD, UserRole.ZONALHEAD]
        if role in roles_requiring_payment:
            has_bank_details = all([
                values.bank_account_holder,
                values.bank_name,
                values.bank_account_number,
                values.bank_ifsc_code
            ])
            has_vpa = bool(values.vpa_id)
            
            if not has_bank_details and not has_vpa:
                raise ValueError("Either bank details or VPA ID is required for this role")
            
            if has_bank_details and has_vpa:
                raise ValueError("Cannot provide both bank details and VPA ID. Choose one payment method")
        
        return values
    
class UserUpdate(BaseModel):
    t_no: Optional[str] = None
    name: Optional[str] = None
    designation: Optional[str] = None
    hq: Optional[str] = None
    responsibility: Optional[str] = None
    role: Optional[UserRole] = None
    reports_to: Optional[int] = None
    status: Optional[bool] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    
    # Address fields
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = Field(None, min_length=6, max_length=6)
    
    # Location for printers
    location: Optional[str] = None
    
    # Geolocation for mechanics
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    company_name: Optional[str] = None
    
    # Bank details
    bank_account_holder: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    vpa_id: Optional[str] = None
    
    
    # Add this validator to UserBase
    @field_validator('vpa_id')
    def validate_vpa_format(cls, v):
        if v is not None:
            # Basic VPA validation - should be in format name@provider
            if '@' not in v or len(v.split('@')) != 2:
                raise ValueError('VPA should be in format: name@provider')
            name_part, provider_part = v.split('@')
            if not name_part or not provider_part:
                raise ValueError('VPA should be in format: name@provider')
        return v
    
    # Validate latitude and longitude
    @field_validator('latitude', 'longitude')
    def validate_coordinates(cls, v, info):
        if v is not None:
            field_name = info.field_name
            if field_name == 'latitude' and not (-90 <= v <= 90):
                raise ValueError('Latitude must be between -90 and 90')
            if field_name == 'longitude' and not (-180 <= v <= 180):
                raise ValueError('Longitude must be between -180 and 180')
        return v

class UserInDB(UserBase):
    user_id: int
    status: bool
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    updated_by: Optional[int] = None

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    user_id: int
    status: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
class OnboarderResponse(BaseModel):
    name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    user_id: Optional[int] = None

class UserResponseWithOnboarder(UserResponse):
    onboarder: Optional[OnboarderResponse] = None

    class Config:
        from_attributes = True