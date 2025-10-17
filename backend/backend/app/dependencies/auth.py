from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.crud.user import get_user, get_user_by_email
from app.schemas.token import TokenData
from app.model.usermaster import UserMaster
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")  # Now sub contains user_id
        role: str = payload.get("role")
        
        if user_id is None or role is None:
            raise credentials_exception
            
        token_data = TokenData(user_id=user_id, role=role)  # Update TokenData usage
    
    except JWTError:
        raise credentials_exception
    
    # Get user by ID instead of email
    user = get_user(db, int(user_id))  # Convert user_id back to integer
    if user is None:
        raise credentials_exception
        
    return user

async def get_current_active_user(current_user: UserMaster = Depends(get_current_user)):
    if not current_user.status:  # Changed from status != "active" to not status
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Role-based dependency for single role (KEEP THIS AS IS)
def require_role(required_role: str):
    def role_checker(current_user: UserMaster = Depends(get_current_active_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Require {required_role} role"
            )
        return current_user
    return role_checker

# NEW: Role-based dependency for multiple roles
def require_any_role(required_roles: List[str]):
    def role_checker(current_user: UserMaster = Depends(get_current_active_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Require one of {required_roles} roles"
            )
        return current_user
    return role_checker
