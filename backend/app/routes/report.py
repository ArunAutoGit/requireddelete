# app/routes/printer_report.py
from fastapi import APIRouter, Depends, HTTPException, Query, Security
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.services.report_service import ReportService
from app.schemas.report import PrinterReportResponse, CouponReportResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/printer-report", response_model=List[PrinterReportResponse])
async def get_printer_report(
    current_user = Security(get_current_user),  # Remove type annotation to handle both dict and ORM
    db: Session = Depends(get_db),
    start_date: Optional[datetime] = Query(None, description="Start date for filtering (YYYY-MM-DD)"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return")
):
    """
    Get printer report for the authenticated user with status=PRINTED only.
    """
    try:
        # Handle both dictionary and ORM object responses from get_current_user
        if hasattr(current_user, 'user_id'):  # ORM object
            user_id = current_user.user_id
        elif isinstance(current_user, dict) and 'user_id' in current_user:  # Dictionary
            user_id = current_user.get('user_id')
        else:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        # Get data from service
        results = ReportService.get_printer_report(
            db=db,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=limit
        )
        
        # Convert to response format with serial numbers
        response_data = []
        for index, row in enumerate(results, start=skip + 1):
            response_data.append({
                "s_no": index,
                "reference_batch_id": row.reference_batch_id,
                "user_id": row.user_id,
                "part_name": row.part_name,
                "batch_quantity": row.batch_quantity,
                "printed_on": row.printed_on
            })
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating printer report: {str(e)}")


@router.get("/printer-report/count")
async def get_printer_report_count(
    current_user = Security(get_current_user),  # Remove type annotation
    db: Session = Depends(get_db),
    start_date: Optional[datetime] = Query(None, description="Start date for filtering"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering")
):
    """
    Get total count of printed batches for the authenticated user
    """
    try:
        # Handle both dictionary and ORM object responses
        if hasattr(current_user, 'user_id'):  # ORM object
            user_id = current_user.user_id
        elif isinstance(current_user, dict) and 'user_id' in current_user:  # Dictionary
            user_id = current_user.get('user_id')
        else:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        total_count = ReportService.get_printer_total_count(
            db=db,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date
        )
        
        return {"total_count": total_count}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting count: {str(e)}")
    
@router.get("/coupon-report", response_model=List[CouponReportResponse])
async def get_coupon_report(
    current_user = Security(get_current_user),
    db: Session = Depends(get_db),
    batch_id: Optional[int] = Query(None, description="Filter by specific batch ID"),
    coupon_status: Optional[str] = Query(None, description="Filter by coupon status (from couponlabel table)"),  # Renamed parameter
    start_date: Optional[datetime] = Query(None, description="Start date for filtering"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return")
):
    """
    Get coupon report with the following columns:
    - S.No. (auto-generated serial number)
    - Unique Batch ID
    - Coupon Unique Number
    - Part Number
    - Amount (mechanic_coupon_inner)
    
    Only includes coupons from batches that have been printed (status = PRINTED)
    and were created by the authenticated user.
    """
    try:
        # Extract user ID from current_user
        if hasattr(current_user, 'user_id'):
            user_id = current_user.user_id
        elif isinstance(current_user, dict) and 'user_id' in current_user:
            user_id = current_user.get('user_id')
        else:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        # Get data from service
        results = ReportService.get_coupon_report(
            db=db,
            user_id=user_id,
            batch_id=batch_id,
            coupon_status=coupon_status,  # Pass the renamed parameter
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=limit
        )
        
        # Convert to response format with serial numbers
        response_data = []
        for index, row in enumerate(results, start=skip + 1):
            response_data.append({
                "s_no": index,
                "unique_batch_id": row.unique_batch_id,
                "coupon_unique_number": row.coupon_unique_number,
                "part_number": row.part_number,
                "amount": float(row.amount) if row.amount else None
            })
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating coupon report: {str(e)}")

@router.get("/coupon-report/count")
async def get_coupon_report_count(
    current_user = Security(get_current_user),
    db: Session = Depends(get_db),
    batch_id: Optional[int] = Query(None, description="Filter by specific batch ID"),
    status: Optional[str] = Query(None, description="Filter by coupon status"),
    start_date: Optional[datetime] = Query(None, description="Start date for filtering"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering")
):
    """
    Get total count of coupons for the authenticated user
    """
    try:
        # Extract user ID from current_user
        if hasattr(current_user, 'user_id'):
            user_id = current_user.user_id
        elif isinstance(current_user, dict) and 'user_id' in current_user:
            user_id = current_user.get('user_id')
        else:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        total_count = ReportService.get_coupon_total_count(
            db=db,
            user_id=user_id,
            batch_id=batch_id,
            status=status,
            start_date=start_date,
            end_date=end_date
        )
        
        return {"total_count": total_count}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting count: {str(e)}")