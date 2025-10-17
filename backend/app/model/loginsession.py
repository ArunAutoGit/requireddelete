from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Boolean
from app.core.database import Base

class LoginSession(Base):
    __tablename__ = "loginsession"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usermaster.user_id"))
    login_time = Column(TIMESTAMP)
    logout_time = Column(TIMESTAMP)
    ip_address = Column(String(50))
    device_info = Column(String(255))
    created_at = Column(TIMESTAMP)
    is_verified = Column(Boolean, default=False)

    otp = Column(String(6), nullable=True)
    otp_expires_at = Column(TIMESTAMP, nullable=True)
