# app/schemas/analytics.py
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date

class StateHeatmapRequest(BaseModel):
    date_range: Optional[str] = Field(
        None, 
        description="Predefined range: last24h, last7d, last15d, last30d, last90d"
    )
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    state: Optional[str] = None
    mechanic_id: Optional[int] = None
    msr_id: Optional[int] = None

class StateHeatmapItem(BaseModel):
    state: str
    scanned_count: int
    unique_mechanics: int
    scan_intensity: float
    average_daily_scans: float

    class Config:
        from_attributes = True

class StateHeatmapSummary(BaseModel):
    total_scanned: int
    total_states: int
    total_mechanics: int
    time_period: str

class StateHeatmapResponse(BaseModel):
    success: bool = True
    data: List[StateHeatmapItem]
    summary: StateHeatmapSummary

