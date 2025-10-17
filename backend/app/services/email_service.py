import smtplib
from email.mime.text import MIMEText
from app.core.config import SMTP_SERVER, SMTP_PORT, EMAIL_ADDRESS, EMAIL_PASSWORD

def send_otp_email(to_email: str, otp: str):
    """Sender OTP via Gmail SMTP"""
    msg = MIMEText(f"Your password reset OTP is: {otp}\nIt will expire in 5 minutes.")
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = "Password Reset OTP"

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"✅ OTP sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send OTP to {to_email}: {str(e)}")
        raise
