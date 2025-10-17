import razorpay
import aiohttp
import json
from typing import Optional, Dict, Any
from app.core.config import settings
from app.schemas.payment import ContactCreate, FundAccountCreate

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        self.base_url = "https://api.razorpay.com/v1"
        self.auth = aiohttp.BasicAuth(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        print(f"Razorpay client initialized with key: {settings.RAZORPAY_KEY_ID}")
    
    async def create_contact(self, contact_data: ContactCreate) -> Optional[Dict]:
        """Create contact using direct API call"""
        try:
            print(f"Creating contact for: {contact_data.name}")
            
            # Convert enum to string for JSON serialization
            contact_dict = contact_data.dict()
            contact_dict['type'] = contact_dict['type'].value  # Convert enum to string
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/contacts"
                headers = {'Content-Type': 'application/json'}
                
                async with session.post(url, json=contact_dict, auth=self.auth, headers=headers) as response:
                    # Accept both 200 and 201 as success
                    if response.status in [200, 201]:
                        result = await response.json()
                        print(f"✅ Contact created successfully: {result.get('id')}")
                        return result
                    else:
                        error_text = await response.text()
                        print(f"❌ Contact creation failed: {response.status} - {error_text}")
                        return None
                        
        except Exception as e:
            print(f"❌ Error creating contact: {str(e)}")
            return None
    
    async def create_fund_account(self, fund_account_data: FundAccountCreate) -> Optional[Dict]:
        """Create fund account using direct API"""
        try:
            print(f"Creating fund account of type: {fund_account_data.account_type}")
            
            # Convert to dict using the schema's dict method
            fund_account_dict = fund_account_data.dict()
            
            print(f"🔍 Fund account data being sent: {fund_account_dict}")
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/fund_accounts"
                headers = {'Content-Type': 'application/json'}
                
                async with session.post(url, json=fund_account_dict, auth=self.auth, headers=headers) as response:
                    # Accept both 200 and 201 as success
                    if response.status in [200, 201]:
                        result = await response.json()
                        print(f"✅ Fund account created successfully: {result.get('id')}")
                        return result
                    else:
                        error_text = await response.text()
                        print(f"❌ Fund account creation failed: {response.status} - {error_text}")
                        return None
                        
        except Exception as e:
            print(f"❌ Error creating fund account: {str(e)}")
            return None

razorpay_service = RazorpayService()