import re
from typing import List
from venv import logger
from app.schemas.scan_batch import ScanBatchDetail, ScanBatchResponse, ScanBatchSummary
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.dependencies.auth import require_any_role
from app.schemas.user import UserResponse
from app.services.redeem_service import RedeemService
from app.services.draft_service import DraftService
from app.model.couponlabel import CouponLabel
from app.schemas.redeem import CouponScanByUniqueNumberRequest, CouponScanRequest, CouponScanResponse, BatchValidationRequest, BatchValidationResponse
from app.schemas.draft import DraftSessionCreate, DraftSessionUpdate, DraftSessionOut, DraftSessionResponse, DraftSessionExistsResponse
import base64
from app.services.ocr_service import extract_text_from_image         
from fastapi import UploadFile, File, Form

router = APIRouter(prefix="/redeem", tags=["Redeem"])

# Define allowed roles for scanning
SCANNER_ROLES = ["msr", "statehead", "zonalhead"]


# Add this endpoint to your existing router
@router.post("/scan-by-image", response_model=CouponScanResponse)
async def scan_coupon_by_image(
    draft_session_id: str = Form(...),
    image_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """
    Scan a coupon by uploading an image (OCR) and add to draft session.
    Expects multipart/form-data with 'draft_session_id' and 'image_file'.
    """
    try:
        logger.info(f"Received image scan request for draft session: {draft_session_id}")
        
        # 1. Read the image file into memory as bytes
        image_bytes = await image_file.read()
        logger.debug(f"Image size: {len(image_bytes)} bytes")
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        # 2. Perform OCR on the image bytes
        extracted_text = extract_text_from_image(image_bytes)
        logger.info(f"Extracted Text: {extracted_text}")
        
        # 3. Search for the unique number pattern (15-17 digits)
        unique_number_pattern = r'\b\d{15,17}\b'
        match = re.search(unique_number_pattern, extracted_text)
        
        if not match:
            logger.warning("No unique number found in extracted text")
            return CouponScanResponse(
                coupon_id=0,
                unique_num="",
                batch_id=0,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status="INVALID",
                is_valid=False,
                error_message="Could not find a valid unique number in the image.",
                draft_updated=False
            )
        
        found_unique_number = match.group().strip()
        logger.info(f"Found unique number via OCR: {found_unique_number}")
        
        # 4. Create the internal request object
        internal_request = CouponScanByUniqueNumberRequest(
            unique_number=found_unique_number,
            draft_session_id=draft_session_id
        )
        
        # 5. Process the request using the refactored logic
        # You'll need to implement process_coupon_scan_request or use existing logic
        response = RedeemService.process_coupon_scan_request(internal_request, db, current_user)
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions (e.g., from auth dependencies)
        raise
    except Exception as e:
        logger.error(f"Unexpected error in scan-by-image: {str(e)}")
        return CouponScanResponse(
            coupon_id=0,
            unique_num="",
            batch_id=0,
            product_name="",
            part_no="",
            grade="",
            size="",
            cell="",
            coupon_value=0,
            status="ERROR",
            is_valid=False,
            error_message=f"Image processing error: {str(e)}",
            draft_updated=False
        )
                
@router.post("/scan", response_model=CouponScanResponse)
async def scan_coupon(
    request: CouponScanRequest,  # Use the new request model
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Scan a coupon, validate it, and automatically add to draft session"""
    
    try:
        # Decode the token
        decoded_data = RedeemService.decode_qr_token(request.token)
        if not decoded_data:
            return CouponScanResponse(
                coupon_id=0,
                unique_num="",
                batch_id=0,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status="INVALID",
                is_valid=False,
                error_message="Invalid token format",
                draft_updated=False
            )
        
        # Extract unique number
        unique_num = RedeemService.extract_unique_num(decoded_data)
        if not unique_num:
            return CouponScanResponse(
                coupon_id=0,
                unique_num="",
                batch_id=0,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status="INVALID",
                is_valid=False,
                error_message="Malformed token data",
                draft_updated=False
            )
        
        # Validate coupon
        validation_result = RedeemService.validate_coupon(db, unique_num)
        
        if not validation_result["is_valid"]:
            coupon = validation_result.get("coupon")
            return CouponScanResponse(
                coupon_id=coupon.coupon_id if coupon else 0,
                unique_num=unique_num,
                batch_id=coupon.batch_id if coupon else 0,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status=coupon.status if coupon else "INVALID",
                is_valid=False,
                error_message=validation_result["error"],
                draft_updated=False
            )
        
        # Get coupon details
        coupon = validation_result["coupon"]
        batch, product = RedeemService.get_coupon_details(db, coupon.batch_id)
        
        if not batch or not product:
            return CouponScanResponse(
                coupon_id=coupon.coupon_id,
                unique_num=coupon.unique_num,
                batch_id=coupon.batch_id,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status="INVALID",
                is_valid=False,
                error_message="Batch or product not found",
                draft_updated=False
            )
        
        # Add to draft session (only if coupon is valid)
        draft_updated = RedeemService.add_coupon_to_draft(
            db, request.draft_session_id, current_user.user_id, unique_num
        )
        
        return CouponScanResponse(
            coupon_id=coupon.coupon_id,
            unique_num=coupon.unique_num,
            batch_id=coupon.batch_id,
            product_name=product.product_name,
            part_no=product.part_no,
            grade=product.grade,
            size=product.size,
            cell=product.cell,
            coupon_value=float(batch.coupon_value),
            status=coupon.status,
            is_valid=True,
            error_message=None,
            draft_updated=draft_updated
        )
        
    except Exception as e:
        return CouponScanResponse(
            coupon_id=0,
            unique_num="",
            batch_id=0,
            product_name="",
            part_no="",
            grade="",
            size="",
            cell="",
            coupon_value=0,
            status="ERROR",
            is_valid=False,
            error_message=f"Scan error: {str(e)}",
            draft_updated=False
        )
        
@router.post("/scan-by-unique-number", response_model=CouponScanResponse)
async def scan_coupon_by_unique_number(
    request: CouponScanByUniqueNumberRequest,  
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Scan a coupon by unique number (for OCR/typing alternatives) and add to draft session"""
    
    try:
        unique_num = request.unique_number.strip()
        
        # Validate coupon
        validation_result = RedeemService.validate_coupon(db, unique_num)
        
        if not validation_result["is_valid"]:
            coupon = validation_result.get("coupon")
            return CouponScanResponse(
                coupon_id=coupon.coupon_id if coupon else 0,
                unique_num=unique_num,
                batch_id=coupon.batch_id if coupon else 0,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status=coupon.status if coupon else "INVALID",
                is_valid=False,
                error_message=validation_result["error"],
                draft_updated=False
            )
        
        # Get coupon details
        coupon = validation_result["coupon"]
        batch, product = RedeemService.get_coupon_details(db, coupon.batch_id)
        
        if not batch or not product:
            return CouponScanResponse(
                coupon_id=coupon.coupon_id,
                unique_num=coupon.unique_num,
                batch_id=coupon.batch_id,
                product_name="",
                part_no="",
                grade="",
                size="",
                cell="",
                coupon_value=0,
                status="INVALID",
                is_valid=False,
                error_message="Batch or product not found",
                draft_updated=False
            )
        
        # Add to draft session (only if coupon is valid)
        draft_updated = RedeemService.add_coupon_to_draft(
            db, request.draft_session_id, current_user.user_id, unique_num
        )
        
        return CouponScanResponse(
            coupon_id=coupon.coupon_id,
            unique_num=coupon.unique_num,
            batch_id=coupon.batch_id,
            product_name=product.product_name,
            part_no=product.part_no,
            grade=product.grade,
            size=product.size,
            cell=product.cell,
            coupon_value=float(batch.coupon_value),
            status=coupon.status,
            is_valid=True,
            error_message=None,
            draft_updated=draft_updated
        )
        
    except Exception as e:
        return CouponScanResponse(
            coupon_id=0,
            unique_num="",
            batch_id=0,
            product_name="",
            part_no="",
            grade="",
            size="",
            cell="",
            coupon_value=0,
            status="ERROR",
            is_valid=False,
            error_message=f"Scan error: {str(e)}",
            draft_updated=False
        )

@router.post("/validate-batch", response_model=BatchValidationResponse)
async def validate_scanned_coupons(
    request: BatchValidationRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Validate all scanned coupons in a draft session and update database"""
    
    try:
        result = RedeemService.validate_batch(db, request.draft_session_id, current_user.user_id)
        
        # Ensure scan_batch_id is always present
        if "scan_batch_id" not in result:
            result["scan_batch_id"] = request.draft_session_id
        
        return BatchValidationResponse(
            success=result["success"],
            message=result["message"],
            validated_count=result["validated_count"],
            failed_count=result["failed_count"],
            failed_coupons=result["failed_coupons"],
            draft_session_id=result["draft_session_id"],
            scan_batch_id=result["scan_batch_id"],
            total_cost=result.get("total_cost", 0.0)  # ADD THIS LINE
        )
        
    except Exception as e:
        db.rollback()
        return BatchValidationResponse(
            success=False,
            message=f"Validation failed: {str(e)}",
            validated_count=0,
            failed_count=0,
            failed_coupons=[],
            draft_session_id=request.draft_session_id,
            scan_batch_id=request.draft_session_id,
            total_cost=0.0  # ADD THIS LINE
        )
        
# Draft session endpoints
@router.post("/draft-sessions", response_model=DraftSessionResponse)
async def create_draft_session(
    draft_data: DraftSessionCreate,  # This should now include location fields
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Create a new draft scanning session with location data"""
    try:
        draft_session = DraftService.create_draft_session(
            db, 
            current_user.user_id,  # Use current user's ID, not from request
            draft_data.mechanic_id,
            draft_data.mechanic_address,
            draft_data.scan_latitude,    # Pass latitude
            draft_data.scan_longitude    # Pass longitude
        )
        return DraftSessionResponse(
            success=True,
            draft_session_id=draft_session.draft_session_id,
            message="Draft session created successfully"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create draft session: {str(e)}")

@router.get("/draft-sessions/check-mechanic/{mechanic_id}", response_model=DraftSessionExistsResponse)
async def check_mechanic_draft_exists(
    mechanic_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Check if an active draft exists for a mechanic"""
    exists = DraftService.check_mechanic_draft_exists(db, mechanic_id)
    
    if exists:
        # Get the existing draft details
        existing_draft = DraftService.get_mechanic_active_draft(db, mechanic_id)
        return DraftSessionExistsResponse(
            success=True,
            draft_session_id=existing_draft.draft_session_id,
            message="Active draft session exists for this mechanic",
            exists=True
        )
    else:
        return DraftSessionExistsResponse(
            success=True,
            draft_session_id=0,
            message="No active draft session for this mechanic",
            exists=False
        )

@router.get("/draft-sessions/mechanic/{mechanic_id}", response_model=DraftSessionOut)
async def get_mechanic_active_draft(
    mechanic_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Get active draft session for a specific mechanic"""
    draft_session = DraftService.get_mechanic_active_draft(db, mechanic_id)
    
    if not draft_session:
        raise HTTPException(status_code=404, detail="No active draft session found for this mechanic")
    
    return DraftSessionOut(
        draft_session_id=draft_session.draft_session_id,
        user_id=draft_session.user_id,
        mechanic_id=draft_session.mechanic_id,
        mechanic_address=draft_session.mechanic_address,
        scanned_coupons=draft_session.scanned_coupons,
        scanned_count=len(draft_session.scanned_coupons),
        created_at=draft_session.created_at,
        updated_at=draft_session.updated_at,
        is_active=draft_session.is_active
    )

@router.get("/draft-sessions", response_model=List[DraftSessionOut])
async def get_user_draft_sessions(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Get all draft sessions for the current user"""
    draft_sessions = DraftService.get_user_drafts(db, current_user.user_id)
    
    return [
        DraftSessionOut(
            draft_session_id=session.draft_session_id,
            user_id=session.user_id,
            mechanic_id=session.mechanic_id,
            mechanic_address=session.mechanic_address,
            scanned_coupons=session.scanned_coupons,
            scanned_count=len(session.scanned_coupons),
            created_at=session.created_at,
            updated_at=session.updated_at,
            is_active=session.is_active
        )
        for session in draft_sessions
    ]

@router.get("/draft-sessions/{draft_session_id}", response_model=DraftSessionOut)
async def get_draft_session(
    draft_session_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Get a specific draft session"""
    draft_session = DraftService.get_draft_session(db, draft_session_id, current_user.user_id)
    if not draft_session:
        raise HTTPException(status_code=404, detail="Draft session not found")
    
    return DraftSessionOut(
        draft_session_id=draft_session.draft_session_id,
        user_id=draft_session.user_id,
        mechanic_id=draft_session.mechanic_id,
        mechanic_address=draft_session.mechanic_address,
        scanned_coupons=draft_session.scanned_coupons,
        scanned_count=len(draft_session.scanned_coupons),
        created_at=draft_session.created_at,
        updated_at=draft_session.updated_at,
        is_active=draft_session.is_active
    )

@router.delete("/draft-sessions/{draft_session_id}")
async def delete_draft_session(
    draft_session_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES))
):
    """Delete a draft session"""
    success = DraftService.delete_draft_session(db, draft_session_id, current_user.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Draft session not found")
    
    return {"message": "Draft session deleted successfully"}

@router.get("/scan-batches", response_model=List[ScanBatchSummary])
async def get_scan_batches(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES + ["admin"]))
):
    """Get all scan batches for the current user"""
    # For regular users, show only their batches
    # For admins, might show all batches
    
    scan_batches = db.query(CouponLabel).filter(
        CouponLabel.scanned_by == current_user.user_id
    ).distinct(CouponLabel.scan_batch_id).all()
    
    # This is a simplified example - you might want a more efficient query
    results = []
    for batch in scan_batches:
        if batch.scan_batch_id:
            batch_details = db.query(CouponLabel).filter(
                CouponLabel.scan_batch_id == batch.scan_batch_id
            ).all()
            
            results.append(ScanBatchSummary(
                scan_batch_id=batch.scan_batch_id,
                total_coupons=len(batch_details),
                validated_count=len([c for c in batch_details if c.status == "SCANNED"]),
                failed_count=len([c for c in batch_details if c.status != "SCANNED"]),
                scanned_by=current_user.name,
                scanned_on=batch.scanned_on or datetime.now(),
                status="COMPLETED"
            ))
    
    return results

@router.get("/scan-batches/{scan_batch_id}", response_model=ScanBatchResponse)
async def get_scan_batch_details(
    scan_batch_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_any_role(SCANNER_ROLES + ["admin"]))
):
    """Get detailed information about a specific scan batch"""
    coupons = db.query(CouponLabel).filter(
        CouponLabel.scan_batch_id == scan_batch_id
    ).all()
    
    if not coupons:
        raise HTTPException(status_code=404, detail="Scan batch not found")
    
    # Verify the user has access to this batch
    if current_user.role not in ["admin"] and coupons[0].scanned_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    coupon_details = []
    for coupon in coupons:
        # Get product details for each coupon
        batch, product = RedeemService.get_coupon_details(db, coupon.batch_id)
        
        coupon_details.append(ScanBatchDetail(
            coupon_id=coupon.coupon_id,
            unique_num=coupon.unique_num,
            batch_id=coupon.batch_id,
            product_name=product.product_name if product else "Unknown",
            status=coupon.status,
            scanned_at=coupon.scanned_on or datetime.now()
        ))
    
    summary = ScanBatchSummary(
        scan_batch_id=scan_batch_id,
        total_coupons=len(coupons),
        validated_count=len([c for c in coupons if c.status == "SCANNED"]),
        failed_count=len([c for c in coupons if c.status != "SCANNED"]),
        scanned_by=current_user.name,
        scanned_on=coupons[0].scanned_on or datetime.now(),
        status="COMPLETED"
    )
    
    return ScanBatchResponse(
        summary=summary,
        coupons=coupon_details
    )

# Background task for cleaning up old drafts
@router.post("/cleanup-drafts")
async def cleanup_old_drafts(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Clean up old draft sessions (admin endpoint)"""
    background_tasks.add_task(DraftService.cleanup_old_drafts, db)
    return {"message": "Draft cleanup started"}