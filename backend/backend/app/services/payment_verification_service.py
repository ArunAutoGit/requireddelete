import asyncio
from sqlalchemy.orm import Session
from app.services.razorpay_service import razorpay_service
from app.crud.payment import get_payment_profile, update_payment_profile

class PaymentVerificationService:
    async def verify_pending_profiles(self, db: Session):
        """Poll Razorpay to check status of pending payment profiles"""
        # This would be called periodically (e.g., via cron job)
        pending_profiles = self._get_pending_profiles(db)
        
        for profile in pending_profiles:
            await self._verify_single_profile(db, profile)
    
    def _get_pending_profiles(self, db: Session):
        """Get profiles with pending verification"""
        # Implementation depends on your query structure
        pass
    
    async def _verify_single_profile(self, db: Session, profile):
        """Verify a single payment profile"""
        if profile.razorpay_contact_id:
            contact_status = await razorpay_service.get_contact_status(profile.razorpay_contact_id)
            if contact_status and contact_status.get('active'):
                update_payment_profile(db, profile.user_id, verification_status='verified')
        
        if profile.razorpay_fund_account_id:
            fund_account_status = await razorpay_service.get_fund_account_status(profile.razorpay_fund_account_id)
            if fund_account_status and fund_account_status.get('active'):
                update_payment_profile(db, profile.user_id, verification_status='verified')

payment_verification_service = PaymentVerificationService()