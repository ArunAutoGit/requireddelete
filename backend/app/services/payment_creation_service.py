from sqlalchemy.orm import Session
from app.model.usermaster import UserMaster
from app.crud.payment import create_payment_profile, update_payment_profile, get_payment_profile
from app.schemas.payment import ContactCreate, FundAccountCreate, AccountType, ContactType,VpaDetails  
from app.services.razorpay_service import razorpay_service
import asyncio

async def create_user_payment_profile_async(db: Session, user: UserMaster):
    """Async version for use in background tasks"""
    return await _create_payment_profile_internal(db, user)

def create_user_payment_profile(db: Session, user: UserMaster):
    """Sync version for use in sync contexts"""
    try:
        # Try to get the current event loop
        loop = asyncio.get_event_loop()
        # If we're in an async context, run it properly
        if loop.is_running():
            # Schedule it to run soon
            asyncio.create_task(_create_payment_profile_internal(db, user))
            return None
        else:
            # Run it synchronously
            return asyncio.run(_create_payment_profile_internal(db, user))
    except RuntimeError:
        # No event loop, run it synchronously
        return asyncio.run(_create_payment_profile_internal(db, user))

async def _create_payment_profile_internal(db: Session, user: UserMaster):
    """Internal implementation of payment profile creation"""
    try:
        # Only create for eligible roles
        eligible_roles = ['msr', 'statehead', 'zonalhead']
        if user.role not in eligible_roles:
            print(f"Skipping payment profile creation for role: {user.role}")
            return None
        
        # Check if user already has a payment profile
        existing_profile = get_payment_profile(db, user.user_id)
        if existing_profile:
            print(f"Payment profile already exists for user {user.user_id}")
            return existing_profile
        
        print(f"Creating payment profile for user {user.user_id} with role {user.role}")
        
        # Create payment profile record
        payment_profile = create_payment_profile(db, user.user_id)
        
        # Create Razorpay contact
        contact_data = ContactCreate(
            name=user.name,
            email=user.email,
            contact=user.mobile,
            type=ContactType.VENDOR,
            reference_id=f"user_{user.user_id}",
            notes={"role": user.role, "user_id": str(user.user_id)}
        )
        
        contact_response = await razorpay_service.create_contact(contact_data)
        if not contact_response:
            raise Exception("Failed to create Razorpay contact")
        
        contact_id = contact_response.get('id')
        print(f"Created Razorpay contact: {contact_id}")
        update_payment_profile(db, user.user_id, razorpay_contact_id=contact_id)
        
        # Create fund account - use direct dictionary approach
        if user.vpa_id:
            print(f"Creating VPA fund account with VPA: {user.vpa_id}")
            
            fund_account_data = {
                "contact_id": contact_id,
                "account_type": "vpa",  # Use string directly
                "vpa": {
                    "address": user.vpa_id.strip()
                }
            }
        else:
            print(f"Creating bank account fund account for {user.bank_account_holder}")
            fund_account_data = {
                "contact_id": contact_id,
                "account_type": "bank_account",  # Use string directly
                "bank_account": {
                    "name": user.bank_account_holder,
                    "ifsc": user.bank_ifsc_code,
                    "account_number": user.bank_account_number
                }
            }
        
        print(f"Fund account data: {fund_account_data}")
        
        # Use direct API call for fund account
        fund_account_response = await razorpay_direct_create_fund_account(fund_account_data)
        if fund_account_response:
            fund_account_id = fund_account_response.get('id')
            print(f"✅ Created Razorpay fund account: {fund_account_id}")
            update_payment_profile(db, user.user_id, razorpay_fund_account_id=fund_account_id)
            update_payment_profile(db, user.user_id, verification_status='verified')
            print(f"✅ Payment profile created successfully for user {user.user_id}")
        else:
            print("❌ Failed to create fund account")
            update_payment_profile(db, user.user_id, verification_status='failed')
        
        return payment_profile
        
    except Exception as e:
        print(f"❌ Error creating payment profile for user {user.user_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        # Mark as failed
        update_payment_profile(db, user.user_id, verification_status='failed')
        return None

async def razorpay_direct_create_fund_account(fund_account_data: dict):
    """Direct API call for fund account creation"""
    try:
        from app.core.config import settings
        import aiohttp
        
        auth = aiohttp.BasicAuth(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        
        async with aiohttp.ClientSession() as session:
            url = "https://api.razorpay.com/v1/fund_accounts"
            headers = {'Content-Type': 'application/json'}
            
            async with session.post(url, json=fund_account_data, auth=auth, headers=headers) as response:
                if response.status in [200, 201]:
                    result = await response.json()
                    print(f"✅ Fund account created successfully: {result.get('id')}")
                    return result
                else:
                    error_text = await response.text()
                    print(f"❌ Fund account creation failed: {response.status} - {error_text}")
                    return None
                    
    except Exception as e:
        print(f"❌ Error in direct fund account creation: {str(e)}")
        return None