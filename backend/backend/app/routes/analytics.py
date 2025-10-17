# app/routes/analytics.py
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.core.database import get_db
from app.schemas.analytics import StateHeatmapResponse
from app.services.analytics_service import AnalyticsService
from app.dependencies.auth import require_any_role

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# Define allowed roles for analytics
ANALYTICS_ROLES = ["admin", "statehead", "zonalhead", "finance"]

@router.get("/heatmap/state-wise", response_model=StateHeatmapResponse)
async def get_state_heatmap(
    date_range: Optional[str] = Query(
        None, 
        description="Predefined range: 'last24h', 'last7d', 'last15d', 'last30d', 'last90d'"
    ),
    start_date: Optional[date] = Query(None, description="Custom start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Custom end date (YYYY-MM-DD)"),
    state: Optional[str] = Query(None, description="Filter by specific state"),
    mechanic_id: Optional[int] = Query(None, description="Filter by mechanic ID"),
    msr_id: Optional[int] = Query(None, description="Filter by MSR ID"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_any_role(ANALYTICS_ROLES))
):
    """
    Get state-wise heatmap data for scanned coupons with flexible date ranges
    """
    try:
        # Calculate date range based on parameters
        start_date, end_date = AnalyticsService.calculate_date_range(
            date_range=date_range,
            start_date=start_date,
            end_date=end_date
        )
        
        # Validate date range
        if start_date and end_date and start_date > end_date:
            raise HTTPException(status_code=400, detail="Start date cannot be after end date")
        
        heatmap_data = AnalyticsService.get_state_heatmap_data(
            db=db,
            start_date=start_date,
            end_date=end_date,
            state=state,
            mechanic_id=mechanic_id,
            msr_id=msr_id
        )
        
        return heatmap_data
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch heatmap data: {str(e)}")