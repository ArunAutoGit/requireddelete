# app/crud/user.py
from sqlalchemy.orm import Session
from app.model.usermaster import UserMaster
from app.schemas.user import UserCreate, UserUpdate, UserRole
from app.core.security import get_password_hash, verify_password
from typing import List, Optional
from app.utils.geolocation import calculate_distance
from app.services.payment_creation_service import create_user_payment_profile  # ← ADD THIS IMPORT


def get_user(db: Session, user_id: int) -> Optional[UserMaster]:
    return db.query(UserMaster).filter(UserMaster.user_id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[UserMaster]:
    return db.query(UserMaster).filter(UserMaster.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[UserMaster]:
    return db.query(UserMaster).offset(skip).limit(limit).all()

def get_users_by_reports_to(db: Session, reports_to: int, skip: int = 0, limit: int = 100) -> List[UserMaster]:
    return db.query(UserMaster).filter(UserMaster.reports_to == reports_to).offset(skip).limit(limit).all()

def authenticate_user(db: Session, email: str, password: str) -> Optional[UserMaster]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not user.password_hash:  # Non-login roles don't have password
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_user(db: Session, user_data: dict, created_by: int) -> UserMaster:
    # Only hash password if provided (for login roles)
    if user_data.get('password'):
        hashed_password = get_password_hash(user_data['password'])
    else:
        hashed_password = None  # For non-login roles
    
    # MSR users start with status=False (needs approval), others with status=True
    status = (user_data['role'] != UserRole.MSR)
    
    # Set onboarding_status
    if user_data['role'] == UserRole.MSR:
        onboarding_status = 'pending'  # Needs admin approval
    else:
        onboarding_status = 'approved'  # Auto-approved for other roles
    
    # Remove password and onboarding_status from user_data before creating the user
    user_data_without_password = {k: v for k, v in user_data.items() if k not in ['password', 'onboarding_status']}
    
    db_user = UserMaster(
        **user_data_without_password,
        password_hash=hashed_password,
        status=status,
        onboarding_status=onboarding_status,  # Use our computed value
        created_by=created_by,
        updated_by=created_by
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create payment profile immediately for StateHead and ZonalHead
    if db_user.role in [UserRole.STATEHEAD, UserRole.ZONALHEAD]:
        try:
            # Import here to avoid circular imports
            from app.services.payment_creation_service import create_user_payment_profile
            create_user_payment_profile(db, db_user)
        except Exception as e:
            print(f"Error creating payment profile: {e}")
    
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate, updated_by: int) -> Optional[UserMaster]:
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        update_data['updated_by'] = updated_by
        
        # Handle password update if provided
        if 'password' in update_data:
            if update_data['password']:
                update_data['password_hash'] = get_password_hash(update_data['password'])
            del update_data['password']
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def get_users_by_role(db: Session, role: UserRole) -> List[UserMaster]:
    return db.query(UserMaster).filter(UserMaster.role == role).all()

def get_mechanics_near_location(db: Session, latitude: float, longitude: float, 
                               reports_to_user_id: Optional[int] = None, 
                               max_distance_km: float = 2.0) -> List[UserMaster]:
    """
    Find mechanics near a location, optionally filtered by reports_to relationship.
    
    Args:
        db: Database session
        latitude: Latitude of the search location
        longitude: Longitude of the search location
        reports_to_user_id: If provided, only return mechanics that report to this user
        max_distance_km: Maximum distance in kilometers
    
    Returns:
        List of UserMaster objects representing nearby mechanics
    """
    # Base query for mechanics with coordinates
    query = db.query(UserMaster).filter(
        UserMaster.role == UserRole.MECHANIC,
        UserMaster.latitude.isnot(None),
        UserMaster.longitude.isnot(None)
    )
    
    # Filter by reports_to if specified
    if reports_to_user_id is not None:
        query = query.filter(UserMaster.reports_to == reports_to_user_id)
    
    mechanics = query.all()
    
    # Filter by distance
    nearby_mechanics = []
    
    for mechanic in mechanics:
        distance = calculate_distance(
            latitude, longitude,
            mechanic.latitude, mechanic.longitude
        )
        if distance <= max_distance_km:
            nearby_mechanics.append(mechanic)
    
    return nearby_mechanics

def approve_msr_user(db: Session, user_id: int, approved_by: int) -> Optional[UserMaster]:
    db_user = get_user(db, user_id)
    if db_user and db_user.role == UserRole.MSR:
        db_user.status = True
        db_user.onboarding_status = 'approved'
        db_user.updated_by = approved_by
        db.commit()
        db.refresh(db_user)
        
        # Create payment profile after approval
        create_user_payment_profile(db, db_user)
        
        return db_user
    return None


def reject_msr_user(db: Session, user_id: int, rejected_by: int, reason: str = None) -> Optional[UserMaster]:
    db_user = get_user(db, user_id)
    if db_user and db_user.role == UserRole.MSR:
        db_user.onboarding_status = 'rejected'
        db_user.rejection_reason = reason
        db_user.updated_by = rejected_by
        db.commit()
        db.refresh(db_user)
        return db_user
    return None