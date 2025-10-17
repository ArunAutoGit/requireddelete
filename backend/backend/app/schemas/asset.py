# app/schemas/asset.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class AssetBase(BaseModel):
    asset_name: str = Field(..., max_length=150)
    asset_type: str = Field(..., max_length=50)
    asset_serial_number: Optional[str] = Field(None, max_length=100)
    asset_model: Optional[str] = Field(None, max_length=100)
    asset_specifications: Optional[str] = None
    assigned_to: Optional[int] = None
    assigned_location: Optional[str] = Field(None, max_length=150)
    status: Optional[str] = Field("available", max_length=20)

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    asset_name: Optional[str] = Field(None, max_length=150)
    asset_type: Optional[str] = Field(None, max_length=50)
    asset_serial_number: Optional[str] = Field(None, max_length=100)
    asset_model: Optional[str] = Field(None, max_length=100)
    asset_specifications: Optional[str] = None
    assigned_to: Optional[int] = None
    assigned_location: Optional[str] = Field(None, max_length=150)
    status: Optional[str] = Field(None, max_length=20)

class AssetInDBBase(AssetBase):
    asset_id: int
    allocated_on: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None  # Just the ID, no relationship
    updated_by: Optional[int] = None  # Just the ID, no relationship

    class Config:
        from_attributes = True

class Asset(AssetInDBBase):
    user_name: Optional[str] = None
    user_role: Optional[str] = None
    user_email: Optional[str] = None
    user_mobile: Optional[str] = None

class AssetListResponse(BaseModel):
    total: int
    assets: List[Asset]