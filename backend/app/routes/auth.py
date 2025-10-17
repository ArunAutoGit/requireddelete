from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.crud.user import authenticate_user
from app.schemas.token import Token

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.status:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not approved or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Include user_id as sub and role in the token payload
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role},  # Use user_id as sub
        expires_delta=access_token_expires
    )
    
    # Return only access_token and token_type (remove user_id from response)
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }