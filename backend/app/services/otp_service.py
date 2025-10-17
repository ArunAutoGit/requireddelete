import secrets

def generate_otp():
    """Generer en 6-sifret OTP"""
    return str(secrets.randbelow(1000000)).zfill(6)
