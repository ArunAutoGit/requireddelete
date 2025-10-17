from app.model.couponlabel import CouponLabel
from app.services.location_service import LocationService
from app.utils.coupon_utils import CouponUtils
from sqlalchemy.orm import Session
from app.model.draftsession import DraftSession
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from typing import List, Optional, Dict, Any

class DraftService:
    
    @staticmethod
    def generate_draft_session_id(db: Session):
        """Generate draft session ID in YYMMXXX format using SQL function"""
        current_year_month = datetime.now().strftime("%y%m")  # YYMM format
        
        # Use raw SQL to avoid casting issues and get better performance
        result = db.execute(
            text("""
                SELECT COALESCE(MAX(draft_session_id), 0) 
                FROM draft_sessions 
                WHERE draft_session_id >= :start_range 
                AND draft_session_id < :end_range
            """),
            {
                'start_range': int(f"{current_year_month}000"),
                'end_range': int(f"{current_year_month}999")
            }
        ).scalar()
        
        if result >= int(f"{current_year_month}000"):
            # Extract sequence number and increment
            sequence = (result % 1000) + 1
        else:
            # First sequence of the month
            sequence = 1
        
        # Format as YYMMXXX (3-digit sequence)
        draft_session_id = int(f"{current_year_month}{sequence:03d}")
        return draft_session_id
    
    @staticmethod
    def create_draft_session(db: Session, user_id: int, mechanic_id: int, mechanic_address: str = None, 
                           scan_latitude: Optional[float] = None, scan_longitude: Optional[float] = None,
                           max_retries: int = 3):
        """Create a new draft session with location data"""
        
        # Check for existing draft (your existing code)
        existing_draft = db.query(DraftSession).filter(
            DraftSession.mechanic_id == mechanic_id,
            DraftSession.is_active == True
        ).first()
        
        if existing_draft:
            raise ValueError(f"Active draft session already exists for mechanic ID {mechanic_id}")
        
        # Try to create draft session
        for attempt in range(max_retries):
            try:
                draft_session_id = DraftService.generate_draft_session_id(db)
                
                draft_session = DraftSession(
                    draft_session_id=draft_session_id,
                    user_id=user_id,
                    mechanic_id=mechanic_id,
                    mechanic_address=mechanic_address,
                    scanned_coupons=[],
                    scan_latitude=scan_latitude,
                    scan_longitude=scan_longitude,
                    is_active=True
                )
                
                db.add(draft_session)
                db.commit()
                db.refresh(draft_session)
                
                # Start background location processing
                LocationService.process_draft_location(db, draft_session.draft_session_id)
                
                return draft_session
                
            except IntegrityError as e:
                db.rollback()
                if "duplicate key" in str(e).lower() and attempt < max_retries - 1:
                    continue
                else:
                    raise ValueError(f"Failed to create draft session after {max_retries} attempts: {str(e)}")
            except Exception as e:
                db.rollback()
                raise e
    
    @staticmethod
    def add_coupon_to_draft(db: Session, draft_session_id: int, user_id: int, unique_num: str) -> bool:
        """Add a scanned coupon to a draft session (JSON field handling)"""
        try:
            # Get the draft session
            draft_session = db.query(DraftSession).filter(
                DraftSession.draft_session_id == draft_session_id,
                DraftSession.user_id == user_id,
                DraftSession.is_active == True
            ).first()
            
            if not draft_session:
                return False
            
            # Handle JSON field - ensure it's always a list
            if draft_session.scanned_coupons is None:
                draft_session.scanned_coupons = []
            elif not isinstance(draft_session.scanned_coupons, list):
                # Convert to list if it's not already
                draft_session.scanned_coupons = []
            
            # Check if coupon already exists in draft
            if unique_num in draft_session.scanned_coupons:
                return False  # Coupon already exists
            
            # Add the coupon to the list
            draft_session.scanned_coupons.append(unique_num)
            draft_session.updated_at = datetime.now()
            db.commit()
            db.refresh(draft_session)
            return True
            
        except Exception as e:
            db.rollback()
            print(f"Error adding coupon to draft: {str(e)}")
            return False
    
    @staticmethod
    def get_mechanic_active_draft(db: Session, mechanic_id: int) -> Optional[DraftSession]:
        """Get active draft session for a specific mechanic"""
        draft_session = db.query(DraftSession).filter(
            DraftSession.mechanic_id == mechanic_id,
            DraftSession.is_active == True
        ).first()
        
        # Ensure scanned_coupons is always a list
        if draft_session and draft_session.scanned_coupons is None:
            draft_session.scanned_coupons = []
            
        return draft_session
    
    @staticmethod
    def get_user_drafts(db: Session, user_id: int) -> List[DraftSession]:
        """Get all draft sessions for a user"""
        draft_sessions = db.query(DraftSession).filter(
            DraftSession.user_id == user_id,
            DraftSession.is_active == True
        ).all()
        
        # Ensure scanned_coupons is always a list for each session
        for session in draft_sessions:
            if session.scanned_coupons is None:
                session.scanned_coupons = []
                
        return draft_sessions
    
    @staticmethod
    def get_draft_session(db: Session, draft_session_id: int, user_id: int) -> Optional[DraftSession]:
        """Get draft session by ID with user validation"""
        draft_session = db.query(DraftSession).filter(
            DraftSession.draft_session_id == draft_session_id,
            DraftSession.user_id == user_id,
            DraftSession.is_active == True
        ).first()
        
        # Ensure scanned_coupons is always a list
        if draft_session and draft_session.scanned_coupons is None:
            draft_session.scanned_coupons = []
            
        return draft_session
    
    @staticmethod
    def update_draft_session(db: Session, draft_session_id: int, user_id: int, scanned_coupons: list) -> Optional[DraftSession]:
        """Update draft session with new scanned coupons"""
        draft_session = DraftService.get_draft_session(db, draft_session_id, user_id)
        if not draft_session:
            return None
        
        draft_session.scanned_coupons = scanned_coupons
        draft_session.updated_at = datetime.now()
        db.commit()
        db.refresh(draft_session)
        return draft_session
    
    @staticmethod
    def delete_draft_session(db: Session, draft_session_id: int, user_id: int) -> bool:
        """Delete draft session"""
        draft_session = db.query(DraftSession).filter(
            DraftSession.draft_session_id == draft_session_id,
            DraftSession.user_id == user_id
        ).first()
        
        if draft_session:
            db.delete(draft_session)
            db.commit()
            return True
        return False
    
    @staticmethod
    def cleanup_old_drafts(db: Session, hours_old: int = 24) -> int:
        """Clean up drafts older than specified hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours_old)
        old_drafts = db.query(DraftSession).filter(
            DraftSession.updated_at < cutoff_time
        ).all()
        
        for draft in old_drafts:
            db.delete(draft)
        
        db.commit()
        return len(old_drafts)
    
    @staticmethod
    def check_mechanic_draft_exists(db: Session, mechanic_id: int) -> bool:
        """Check if an active draft exists for a mechanic"""
        existing_draft = db.query(DraftSession).filter(
            DraftSession.mechanic_id == mechanic_id,
            DraftSession.is_active == True
        ).first()
        
        return existing_draft is not None
    
    @staticmethod
    def get_draft_with_details(db: Session, draft_session_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """Get draft session with detailed coupon information"""
        draft_session = DraftService.get_draft_session(db, draft_session_id, user_id)
        if not draft_session:
            return None
        
        # Ensure scanned_coupons is a list
        if draft_session.scanned_coupons is None:
            draft_session.scanned_coupons = []
        
        # Get details for each scanned coupon
        coupon_details = []
        for unique_num in draft_session.scanned_coupons:
            coupon = db.query(CouponLabel).filter(
                CouponLabel.unique_num == unique_num
            ).first()
            
            if coupon:
                # Use CouponUtils instead of RedeemService
                batch, product = CouponUtils.get_coupon_details(db, coupon.batch_id)
                coupon_details.append({
                    "unique_num": unique_num,
                    "coupon_id": coupon.coupon_id,
                    "status": coupon.status,
                    "product_name": product.product_name if product else "Unknown",
                    "part_no": product.part_no if product else "Unknown",
                    "coupon_value": float(batch.coupon_value) if batch else 0
                })
        
        return {
            "draft_session": draft_session,
            "coupon_details": coupon_details
        }
    
    @staticmethod
    def get_draft_coupon_count(db: Session, draft_session_id: int, user_id: int) -> int:
        """Get the number of coupons in a draft session"""
        draft_session = DraftService.get_draft_session(db, draft_session_id, user_id)
        if not draft_session or draft_session.scanned_coupons is None:
            return 0
        return len(draft_session.scanned_coupons)
    
    @staticmethod
    def remove_coupon_from_draft(db: Session, draft_session_id: int, user_id: int, unique_num: str) -> bool:
        """Remove a coupon from a draft session"""
        draft_session = DraftService.get_draft_session(db, draft_session_id, user_id)
        if not draft_session or draft_session.scanned_coupons is None:
            return False
        
        if unique_num in draft_session.scanned_coupons:
            draft_session.scanned_coupons.remove(unique_num)
            draft_session.updated_at = datetime.now()
            db.commit()
            db.refresh(draft_session)
            return True
        
        return False