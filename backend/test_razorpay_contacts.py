import os
import requests
from base64 import b64encode
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

KEY_ID = os.getenv('RAZORPAY_KEY_ID')
KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')

credentials = b64encode(f"{KEY_ID}:{KEY_SECRET}".encode()).decode()

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Basic {credentials}'
}

base_url = "https://api.razorpay.com/v1"

def test_vpa_fund_account():
    """Test VPA fund account creation"""
    print("=== Testing VPA Fund Account ===")
    
    # Use an existing contact ID from your contacts list
    contact_id = "cont_RNILsCidZMZZux"  # From your successful contact creation
    
    # Test different VPA formats
    test_cases = [
        {
            "name": "VPA with @okaxis",
            "data": {
                "contact_id": contact_id,
                "account_type": "vpa",
                "vpa": {
                    "address": "testuser@okaxis"
                }
            }
        },
        {
            "name": "VPA with @okicici", 
            "data": {
                "contact_id": contact_id,
                "account_type": "vpa",
                "vpa": {
                    "address": "testuser@okicici"
                }
            }
        },
        {
            "name": "VPA with @oksbi",
            "data": {
                "contact_id": contact_id,
                "account_type": "vpa", 
                "vpa": {
                    "address": "testuser@oksbi"
                }
            }
        },
        {
            "name": "VPA with @ybl",
            "data": {
                "contact_id": contact_id,
                "account_type": "vpa",
                "vpa": {
                    "address": "testuser@ybl"
                }
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        print(f"Data: {test_case['data']}")
        
        response = requests.post(
            f"{base_url}/fund_accounts",
            headers=headers,
            json=test_case['data']
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ SUCCESS!")
            break
        else:
            print("❌ FAILED")

def test_bank_account_fund_account():
    """Test bank account fund account creation"""
    print("\n=== Testing Bank Account Fund Account ===")
    
    contact_id = "cont_RNILsCidZMZZux"
    
    # Test bank account with test IFSC
    bank_data = {
        "contact_id": contact_id,
        "account_type": "bank_account",
        "bank_account": {
            "name": "Test User",
            "ifsc": "UTIB0000001",  # Test IFSC for Axis Bank
            "account_number": "1234567890"
        }
    }
    
    print(f"Data: {bank_data}")
    
    response = requests.post(
        f"{base_url}/fund_accounts",
        headers=headers,
        json=bank_data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code in [200, 201]:
        print("✅ SUCCESS!")

if __name__ == "__main__":
    test_vpa_fund_account()
    test_bank_account_fund_account()
