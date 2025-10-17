# Create a test script in app/scripts/test_db.py
from app.core.database import engine

try:
    with engine.connect() as connection:
        print("✅ Database connection successful!")
except Exception as e:
    print(f"❌ Database connection failed: {e}")