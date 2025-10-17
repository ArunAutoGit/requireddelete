# app/schemas/geolocation.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude between -90 and 90")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude between -180 and 180")

class NearbyMechanicsRequest(Coordinates):
    max_distance: Optional[float] = Field(2.0, gt=0, description="Maximum distance in kilometers")

class MechanicResponse(BaseModel):
    user_id: int
    # name: str
    # company_name: str
    # mobile: Optional[str] = None
    # address_line1: Optional[str] = None
    # address_line2: Optional[str] = None
    # district: Optional[str] = None
    # state: Optional[str] = None
    # pincode: Optional[str] = None
    # latitude: Optional[float] = None
    # longitude: Optional[float] = None
    # distance: float  # Distance in km

class NearbyMechanicsResponse(BaseModel):
    mechanics: List[MechanicResponse]
    count: int
    


class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

class AddressResponse(BaseModel):
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None

class UserLocationUpdate(BaseModel):
    latitude: float
    longitude: float
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None