from app.schemas.redeem import CouponScanByUniqueNumberRequest, CouponScanResponse
from app.schemas.user import UserResponse
from app.services.draft_service import DraftService
from sqlalchemy.orm import Session
from datetime import datetime
from app.model.couponlabel import CouponLabel
from app.model.couponbatch import CouponBatch
from app.model.productmaster import ProductMaster
from app.model.draftsession import DraftSession
import base64
from sqlalchemy import func, text
from app.services.location_service import LocationService


class RedeemService:
    
    @staticmethod
    def decode_qr_token(token: str):
        """Decode QR token from base64"""
        try:
            padding = len(token) % 4
            if padding:
                token += '=' * (4 - padding)
            decoded_data = base64.urlsafe_b64decode(token).decode('utf-8')
            return decoded_data
        except Exception:
            return None
    
    @staticmethod
    def extract_unique_num(decoded_data: str):
        """Extract unique number from decoded token"""
        if not decoded_data.startswith("coupon_"):
            return None
        
        parts = decoded_data.split("_")
        if len(parts) < 3:
            return None
        
        return parts[1]
    
    @staticmethod
    def validate_coupon(db: Session, unique_num: str):
        """Validate coupon without updating database"""
        coupon = db.query(CouponLabel).filter(
            CouponLabel.unique_num == unique_num
        ).first()
        
        if not coupon:
            return {
                "is_valid": False,
                "error": "Coupon not found in system",
                "coupon": None
            }
        
        if coupon.status != "ACTIVE":
            return {
                "is_valid": False,
                "error": "Coupon already redeemed or invalid",
                "coupon": coupon
            }
        
        return {
            "is_valid": True,
            "error": None,
            "coupon": coupon
        }
    
    @staticmethod
    def get_coupon_details(db: Session, batch_id: int):
        """Get batch and product details for coupon"""
        batch = db.query(CouponBatch).filter(
            CouponBatch.batch_id == batch_id
        ).first()
        
        if not batch:
            return None, None
        
        product = db.query(ProductMaster).filter(
            ProductMaster.product_id == batch.product_id
        ).first()
        
        return batch, product
    
    @staticmethod
    def validate_batch(db: Session, draft_session_id: int, user_id: int):
        """Validate all coupons in a draft session and update with scan_batch_id and location data"""
        draft_session = db.query(DraftSession).filter(
            DraftSession.draft_session_id == draft_session_id,
            DraftSession.user_id == user_id
        ).first()
        
        if not draft_session:
            return {
                "success": False,
                "message": "Draft session not found",
                "validated_count": 0,
                "failed_count": 0,
                "failed_coupons": [],
                "draft_session_id": draft_session_id,
                "scan_batch_id": draft_session_id,
                "total_cost": 0.0
            }
        
        # NEW: Ensure location processing is complete before proceeding
        from app.services.location_service import LocationService
        if draft_session.location_verified is None and draft_session.scan_latitude and draft_session.scan_longitude:
            LocationService.process_draft_location(db, draft_session_id)
            db.refresh(draft_session)  # Refresh to get updated location data
        
        validated_count = 0
        failed_count = 0
        failed_coupons = []
        total_cost = 0.0  # Accumulate total cost
        
        for unique_num in draft_session.scanned_coupons:
            validation_result = RedeemService.validate_coupon(db, unique_num)
            
            if validation_result["is_valid"] and validation_result["coupon"]:
                coupon = validation_result["coupon"]
                
                # Get the batch to access coupon value
                batch = db.query(CouponBatch).filter(
                    CouponBatch.batch_id == coupon.batch_id
                ).first()
                
                if batch:
                    total_cost += float(batch.coupon_value)  # ADD COUPON VALUE TO TOTAL
                
                # Update coupon status AND scan_batch_id
                coupon.status = "SCANNED"
                coupon.scanned_by = user_id
                coupon.scanned_on = datetime.now()
                coupon.scan_batch_id = draft_session_id  # Set the scan_batch_id
                
                # NEW: Copy location data from draft session to coupon
                coupon.scan_latitude = draft_session.scan_latitude
                coupon.scan_longitude = draft_session.scan_longitude
                coupon.scan_address = draft_session.scan_address
                coupon.location_verified = draft_session.location_verified
                coupon.mechanic_id_at_scan = draft_session.mechanic_id
                
                validated_count += 1
            else:
                failed_count += 1
                failed_coupons.append({
                    "unique_num": unique_num,
                    "error": validation_result["error"]
                })
        
        # Deactivate draft session after validation
        draft_session.is_active = False
        db.commit()
        
        return {
            "success": True,
            "message": f"Validated {validated_count} coupons, {failed_count} failed",
            "validated_count": validated_count,
            "failed_count": failed_count,
            "failed_coupons": failed_coupons,
            "draft_session_id": draft_session_id,
            "scan_batch_id": draft_session_id,
            "total_cost": float(total_cost)
        }
        
    @staticmethod
    def add_coupon_to_draft(db: Session, draft_session_id: int, user_id: int, unique_num: str) -> bool:
        """Automated approach that works like your update_draft_session method"""
        try:
            draft_session = DraftService.get_draft_session(db, draft_session_id, user_id)
            if not draft_session:
                print(f"Draft {draft_session_id} not found for user {user_id}")
                return False
            
            # Get current coupons and ensure it's a list
            current_coupons = draft_session.scanned_coupons or []
            
            # Check for duplicate
            if unique_num in current_coupons:
                print(f"Coupon {unique_num} already exists in draft")
                return False
            
            # Create a NEW list instead of modifying in place
            # This ensures SQLAlchemy detects the change
            updated_coupons = current_coupons + [unique_num]
            
            # Use the same pattern as your working method
            draft_session.scanned_coupons = updated_coupons  # Complete replacement
            draft_session.updated_at = datetime.now()
            
            db.commit()
            db.refresh(draft_session)
            
            # Verify the update
            if unique_num in draft_session.scanned_coupons:
                print(f"Successfully added coupon {unique_num} to draft {draft_session_id}")
                return True
            else:
                print(f"Failed to add coupon - verification failed")
                return False
                
        except Exception as e:
            db.rollback()
            print(f"Error adding coupon to draft: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
        
    def process_coupon_scan_request(
        request: CouponScanByUniqueNumberRequest, 
        db: Session, 
        current_user: UserResponse
    ) -> CouponScanResponse:
        """
        Refactored logic from scan_coupon_by_unique_number endpoint.
        Can be called by both OCR and manual input endpoints.
        """
        try:
            unique_num = request.unique_number.strip()
            
            # Validate coupon (using your existing class method)
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
            
            # Get coupon details (using your existing class method)
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
            
            # Add to draft session (using your existing class method)
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