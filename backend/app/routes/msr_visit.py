from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, aliased
from typing import Optional
from datetime import datetime
from sqlalchemy import func
from app.core.database import get_db
from app.schemas.msr_visit import MSRVisit, MSRVisitGrouped
from app.model.couponlabel import CouponLabel
from app.model.usermaster import UserMaster
from app.model.couponbatch import CouponBatch

router = APIRouter()

@router.get("/msr-visits", response_model=list[MSRVisit])
def get_msr_visits(
    start_date: datetime = Query(..., description="Start date for the report (YYYY-MM-DD)"),
    end_date: datetime = Query(..., description="End date for the report (YYYY-MM-DD)"),
    scanner_id: Optional[int] = Query(None, description="Optional ID of a specific MSR to filter by"),
    db: Session = Depends(get_db)
):
    """
    Get a report of all MSR visits (coupon scans) within a date range.
    Includes payment details and location verification status.
    """
    try:
        # Create explicit aliases for the UserMaster table to join twice
        Scanner = aliased(UserMaster)
        Mechanic = aliased(UserMaster)
        
        # Build the query
        query = db.query(
            CouponLabel.coupon_id.label("visit_id"),
            CouponLabel.scanned_on.label("visit_datetime"),
            CouponBatch.coupon_value.label("coupon_amount"),
            
            # Scanner details (from the Scanner alias)
            Scanner.user_id.label("msr_id"),
            Scanner.name.label("msr_name"),
            Scanner.role.label("msr_role"),
            
            # Mechanic details (from the Mechanic alias)
            Mechanic.user_id.label("mechanic_id"),
            Mechanic.name.label("mechanic_name"),
            Mechanic.latitude.label("scheduled_lat"),
            Mechanic.longitude.label("scheduled_lng"),
            
            # Scanned location details
            CouponLabel.scan_latitude.label("scanned_lat"),
            CouponLabel.scan_longitude.label("scanned_lng"),
            CouponLabel.scan_address.label("scanned_address"),
            
            # Core logic: Invert location_verified to get location_mismatch
            # True in DB (match) becomes False (no mismatch). 
            # False in DB (mismatch) becomes True (mismatch).
            (~CouponLabel.location_verified).label("location_mismatch")
        ).join(
            Scanner, Scanner.user_id == CouponLabel.scanned_by  # Join for the Scanner (MSR)
        ).join(
            Mechanic, Mechanic.user_id == CouponLabel.mechanic_id_at_scan  # Join for the Mechanic
        ).join(
            CouponBatch, CouponBatch.batch_id == CouponLabel.batch_id  # Join for the Coupon Value
        ).filter(
            CouponLabel.scanned_on.between(start_date, end_date),
            CouponLabel.status == "SCANNED"
        )
        
        # Apply optional filter for a specific Scanner (MSR)
        if scanner_id is not None:
            query = query.filter(CouponLabel.scanned_by == scanner_id)
        
        # Execute the query and return results
        results = query.order_by(CouponLabel.scanned_on.desc()).all()
        return results

    except Exception as e:
        # Log the exception details here (e.g., using logging.getLogger())
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")
    
@router.get("/msr-visits-grouped", response_model=list[MSRVisitGrouped])
def get_msr_visits_grouped(
    start_date: datetime = Query(..., description="Start date for the report (YYYY-MM-DD)"),
    end_date: datetime = Query(..., description="End date for the report (YYYY-MM-DD)"),
    scanner_id: Optional[int] = Query(None, description="Optional ID of a specific MSR to filter by"),
    db: Session = Depends(get_db)
):
    """
    Get a report of all MSR visits grouped by scan batch and mechanic.
    This avoids duplicate map pins for multiple coupons scanned in the same visit.
    """
    try:
        Scanner = aliased(UserMaster)
        Mechanic = aliased(UserMaster)
        
        # Build the query with proper aggregation
        query = db.query(
            CouponLabel.scan_batch_id,
            func.max(CouponLabel.scanned_on).label("visit_datetime"),  # Aggregate the timestamp
            
            Scanner.user_id.label("msr_id"),
            Scanner.name.label("msr_name"),
            Scanner.role.label("msr_role"),
            
            Mechanic.user_id.label("mechanic_id"),
            Mechanic.name.label("mechanic_name"),
            Mechanic.latitude.label("scheduled_lat"),
            Mechanic.longitude.label("scheduled_lng"),
            
            func.max(CouponLabel.scan_latitude).label("scanned_lat"),
            func.max(CouponLabel.scan_longitude).label("scanned_lng"),
            func.max(CouponLabel.scan_address).label("scanned_address"),
            
            func.bool_and(~CouponLabel.location_verified).label("location_mismatch"),
            
            func.count(CouponLabel.coupon_id).label("total_coupons"),
            func.sum(CouponBatch.coupon_value).label("total_amount")
            
        ).join(
            Scanner, Scanner.user_id == CouponLabel.scanned_by
        ).join(
            Mechanic, Mechanic.user_id == CouponLabel.mechanic_id_at_scan
        ).join(
            CouponBatch, CouponBatch.batch_id == CouponLabel.batch_id
        ).filter(
            CouponLabel.scanned_on.between(start_date, end_date),
            CouponLabel.status == "SCANNED",
            CouponLabel.scan_batch_id.isnot(None)
        ).group_by(
            # Group by the essential identifiers for a unique visit
            CouponLabel.scan_batch_id,
            Mechanic.user_id,
            # Include all other non-aggregated columns from SELECT
            Scanner.user_id,
            Scanner.name,
            Scanner.role,
            Mechanic.name,
            Mechanic.latitude,
            Mechanic.longitude
        )
        
        if scanner_id is not None:
            query = query.filter(CouponLabel.scanned_by == scanner_id)
        
        # FIX: Order by the aggregated timestamp alias, not the raw column
        results = query.order_by(func.max(CouponLabel.scanned_on).desc()).all()
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")