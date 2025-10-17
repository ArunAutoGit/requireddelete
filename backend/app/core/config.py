import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "cschandrup24@gmail.com"
EMAIL_PASSWORD = "rgvq odde lngb mmjw"

class Settings(BaseSettings):
    # Database
    DB_DRIVER: str = "postgresql+psycopg2"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "tvs_cta"
    
    # JWT
    SECRET_KEY: str = "bc115cc466c0c5d93dfa57a3004d2ab118368c78921148dcdab4601808df142a"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 180

    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    
    # QR
    QR_REDEEM_URL: str = "http://localhost:8000/redeem?token="
    
    # AWS Configuration - ADD THESE FIELDS
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID","")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY","")
    AWS_DEFAULT_REGION: str = os.getenv("AWS_DEFAULT_REGION","")
    
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "") 
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    RAZORPAY_ACCOUNT_NUMBER: str = os.getenv("RAZORPAY_ACCOUNT_NUMBER", "")
    
    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()