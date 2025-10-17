from io import BytesIO
from app.model.couponlabel import CouponLabel
from app.services.qr_service import QRCodeService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.services.coupon_service import CouponService
from app.schemas.coupon import CouponBatchCreate, CouponBatchOut, CouponLabelOut
from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.schemas.user import UserResponse, UserRole  # Changed User to UserResponse
from app.schemas.coupon import BatchPrintResponse

router = APIRouter(prefix="/coupon", tags=["Coupon"])

# Use the require_role dependency factory
get_current_printer = require_role(UserRole.PRINTER)

@router.post("/batches", response_model=CouponBatchOut)
def create_coupon_batch(
    batch_data: CouponBatchCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_printer)  # Changed User to UserResponse
):
    """Create a new coupon batch with QR codes - Only for PRINTER role"""
    try:
        coupon_service = CouponService(db)
        batch = coupon_service.create_coupon_batch(batch_data, current_user.user_id)
        return batch
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/batches/{batch_id}", response_model=CouponBatchOut)
def get_coupon_batch(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)  # Changed User to UserResponse
):
    """Get coupon batch details"""
    coupon_service = CouponService(db)
    batch = coupon_service.get_batch_by_id(batch_id)
    
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    return batch

@router.get("/batches/{batch_id}/labels", response_model=List[CouponLabelOut])
def get_batch_labels(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)  # Changed User to UserResponse
):
    """Get all labels for a batch"""
    coupon_service = CouponService(db)
    labels = coupon_service.get_batch_labels(batch_id)
    
    if not labels:
        raise HTTPException(status_code=404, detail="No labels found for this batch")
    
    return labels

@router.post("/batches/{batch_id}/print")
def mark_batch_printed(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_printer)  # Changed User to UserResponse
):
    """Mark batch as printed - Only for PRINTER role"""
    try:
        coupon_service = CouponService(db)
        batch = coupon_service.mark_batch_printed(batch_id, current_user.user_id)
        return {"message": "Batch marked as printed", "batch_id": batch.batch_id}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/batches/{batch_id}/qr-data")
def get_batch_qr_data(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get batch details with QR code data for printing"""
    try:
        coupon_service = CouponService(db)
        qr_data = coupon_service.get_batch_with_qr_codes(batch_id)
        return qr_data
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/batches/{batch_id}/qr-images")
def get_batch_qr_images(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get QR code images for a batch (base64 encoded)"""
    try:
        coupon_service = CouponService(db)
        qr_images = coupon_service.generate_qr_images(batch_id)
        return qr_images
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/batches/{batch_id}/print-data")
def get_batch_print_data(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get complete data for printing labels"""
    try:
        coupon_service = CouponService(db)
        print_data = coupon_service.get_printable_batch_data(batch_id)
        return print_data
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/coupons/{coupon_id}/qr-image")
def get_single_qr_image(
    coupon_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get single QR code image"""
    try:
        coupon_service = CouponService(db)
        qr_service = QRCodeService()
        
        # Get coupon label
        label = db.query(CouponLabel).filter(CouponLabel.coupon_id == coupon_id).first()
        if not label:
            raise HTTPException(status_code=404, detail="Coupon not found")
        
        # Generate QR code
        redeem_url = qr_service.generate_redeem_url(label.qr_code)
        qr_text = f"ID: {label.unique_num}"
        qr_buffer = qr_service.generate_qr_with_text(redeem_url, qr_text)
        
        # Return as image response
        from fastapi.responses import StreamingResponse
        return StreamingResponse(BytesIO(qr_buffer.getvalue()), media_type="image/png")
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/batches/{batch_id}/print", response_model=BatchPrintResponse)
def get_batch_for_printing(
    batch_id: int, 
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get complete batch data for printing labels"""
    try:
        coupon_service = CouponService(db)
        print_data = coupon_service.get_batch_print_data(batch_id)
        return print_data
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/batches/available", response_model=List[CouponBatchOut])
def get_available_batches(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all available batches that are not printed, ordered by newest first"""
    try:
        coupon_service = CouponService(db)
        batches = coupon_service.get_available_batches()
        
        if not batches:
            return []  # Return empty list instead of raising error
        
        return batches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    
@router.get("/batches/available/detailed")
def get_available_batches_detailed(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all available batches with product details, ordered by newest first"""
    try:
        coupon_service = CouponService(db)
        batches = coupon_service.get_available_batches_with_details()
        
        if not batches:
            return []
        
        return batches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")