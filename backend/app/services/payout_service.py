from requests import Session
import razorpay
from typing import Optional, Dict, Any
from app.core.config import settings
from app.schemas.payout import PayoutCreate, PayoutMethod
from app.model.usermaster import UserMaster
from app.crud.payment import get_payment_profile
from datetime import datetime

class PayoutService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    async def create_payout(self, db: Session, payout_data: PayoutCreate, user: UserMaster) -> Optional[Dict]:
        try:
            # Get user's payment profile
            payment_profile = get_payment_profile(db, user.user_id)
            if not payment_profile or not payment_profile.razorpay_fund_account_id:
                raise Exception("User does not have a verified payment profile")
            
            # Determine payout method based on user's payment method
            payout_method = "vpa" if user.vpa_id else "bank_account"
            
            payout_params = {
                "account_number": settings.RAZORPAY_ACCOUNT_NUMBER,
                "fund_account_id": payment_profile.razorpay_fund_account_id,
                "amount": int(payout_data.amount * 100),  # Convert to paise
                "currency": payout_data.currency,
                "mode": payout_method,
                "purpose": payout_data.purpose,
                "queue_if_low_balance": True,
                "reference_id": f"payout_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                "notes": payout_data.notes or {}
            }
            
            payout = self.client.payout.create(payout_params)
            return payout
            
        except Exception as e:
            print(f"Error creating payout: {e}")
            return None
    
    async def get_payout_status(self, razorpay_payout_id: str) -> Optional[Dict]:
        try:
            payout = self.client.payout.fetch(razorpay_payout_id)
            return payout
        except Exception as e:
            print(f"Error fetching payout status: {e}")
            return None

payout_service = PayoutService()