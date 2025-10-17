from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import bcrypt

from app.core.database import get_db
from app.model.usermaster import UserMaster
from app.model.loginsession import LoginSession
from app.services.otp_service import generate_otp
from app.services.email_service import send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/forgot-password/")
def forgot_password(email: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(UserMaster).filter(UserMaster.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = generate_otp()
    otp_entry = LoginSession(
        user_id=user.user_id,
        otp=otp,
        otp_expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(otp_entry)
    db.commit()

    send_otp_email(email, otp)
    return {"message": "OTP sent to your email"}


@router.post("/validate-otp/")
def validate_otp(email: str = Form(...), otp: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(UserMaster).filter(UserMaster.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_entry = (
        db.query(LoginSession)
        .filter(LoginSession.user_id == user.user_id, LoginSession.otp == otp)
        .order_by(LoginSession.session_id.desc())
        .first()
    )

    if not otp_entry:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > otp_entry.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    # ✅ Mark OTP as verified
    otp_entry.is_verified = True
    db.commit()

    return {"message": "OTP verified successfully"}



@router.post("/set-new-password/")
def set_new_password(
    email: str = Form(...), 
    new_password: str = Form(...), 
    db: Session = Depends(get_db)
):
    user = db.query(UserMaster).filter(UserMaster.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_entry = (
        db.query(LoginSession)
        .filter(LoginSession.user_id == user.user_id)
        .order_by(LoginSession.session_id.desc())
        .first()
    )

    if not otp_entry or not otp_entry.is_verified:
        raise HTTPException(status_code=400, detail="OTP not verified")

    # ✅ Hash password properly
    user.password_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Optionally, reset OTP so it can’t be reused
    otp_entry.is_verified = False

    db.commit()

    return {"message": "Password updated successfully"}


# @router.post("/reset-password/")
# def reset_password(email: str = Form(...), otp: str = Form(...), new_password: str = Form(...), db: Session = Depends(get_db)):
#     user = db.query(UserMaster).filter(UserMaster.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     otp_entry = (
#         db.query(LoginSession)
#         .filter(LoginSession.user_id == user.user_id, LoginSession.otp == otp)
#         .order_by(LoginSession.session_id.desc())
#         .first()
#     )

#     if not otp_entry:
#         raise HTTPException(status_code=400, detail="Invalid OTP")

#     if datetime.utcnow() > otp_entry.otp_expires_at:
#         raise HTTPException(status_code=400, detail="OTP expired")

#     # Oppdater passordet (hash)
#     user.password_hash = bcrypt.hash(new_password)
#     db.commit()

#     return {"message": "Password updated successfully"}
