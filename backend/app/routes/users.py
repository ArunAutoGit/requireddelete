# app/api/endpoints/users.py
from venv import logger
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies.auth import get_current_active_user, require_role
from app.schemas.user import UserCreate, UserResponseWithOnboarder, UserUpdate, UserResponse, UserRole, OnboarderResponse
from app.schemas.geolocation import NearbyMechanicsRequest, MechanicResponse, NearbyMechanicsResponse
from app.crud.user import (
    get_user, get_users, create_user, update_user, delete_user,
    get_users_by_role, approve_msr_user, get_user_by_email, 
    get_users_by_reports_to, get_mechanics_near_location,reject_msr_user
)
from app.model.usermaster import UserMaster
from app.utils.geolocation import calculate_distance
from typing import List
from fastapi import Request
from app.services.geocoding import enhanced_osm_geocoder, parse_enhanced_osm_address
from app.schemas.geolocation import ReverseGeocodeRequest, AddressResponse, UserLocationUpdate
router = APIRouter(prefix="/users", tags=["users"])

# Role hierarchy helper
def can_manage_role(current_user_role: UserRole, target_role: UserRole) -> bool:
    role_hierarchy = {
        UserRole.ADMIN: [UserRole.PRINTER, UserRole.FINANCE, UserRole.STATEHEAD, UserRole.ZONALHEAD, UserRole.MSR, UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST],
        UserRole.STATEHEAD: [UserRole.MSR, UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST],
        UserRole.ZONALHEAD: [UserRole.MSR, UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST],
        UserRole.MSR: [UserRole.MECHANIC, UserRole.DEALER, UserRole.STOCKIST],
    }
    return (current_user_role == UserRole.ADMIN or 
            target_role in role_hierarchy.get(current_user_role, []))

# GET /users/ - list users (only those who report to current user)
@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.ADMIN:
        return get_users(db, skip=skip, limit=limit)
    
    # Only show users who report to the current user
    return get_users_by_reports_to(db, current_user.user_id, skip=skip, limit=limit)

# GET /users/{user_id} - get single user (only if they report to current user)
@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Admin can view anyone, others can only view users who report to them
    if current_user.role != UserRole.ADMIN and db_user.reports_to != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    
    return db_user

# POST /users/ - create new user (automatically set reports_to to current user)
@router.post("/", response_model=UserResponse)
async def create_new_user(
    user: UserCreate,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if user can manage the target role
    if not can_manage_role(current_user.role, user.role):
        raise HTTPException(
            status_code=403,
            detail=f"Not authorized to create users with role {user.role}"
        )
    
    # Check email only for login roles
    login_roles = [UserRole.ADMIN, UserRole.FINANCE, UserRole.PRINTER, 
                   UserRole.MSR, UserRole.STATEHEAD, UserRole.ZONALHEAD]
    
    if user.email and user.role in login_roles:
        db_user = get_user_by_email(db, user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Convert UserCreate to dict and set reports_to to current user
    user_data = user.dict()
    user_data['reports_to'] = current_user.user_id
    
    return create_user(db=db, user_data=user_data, created_by=current_user.user_id)

# PUT /users/{user_id} - update user (only if they report to current user)
@router.put("/{user_id}", response_model=UserResponse)
async def update_existing_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Admin can update anyone, others can only update users who report to them
    if current_user.role != UserRole.ADMIN and db_user.reports_to != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    if user_update.role and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admin can change user roles")
    
    return update_user(db=db, user_id=user_id, user_update=user_update, updated_by=current_user.user_id)

# DELETE /users/{user_id} - delete user (only if they report to current user)
@router.delete("/{user_id}")
async def delete_existing_user(
    user_id: int,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Admin can delete anyone, others can only delete users who report to them
    if current_user.role != UserRole.ADMIN and db_user.reports_to != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    delete_user(db=db, user_id=user_id)
    return {"message": "User deleted successfully"}

# POST /users/{user_id}/approve - approve MSR (admin only)
@router.post("/{user_id}/approve", response_model=UserResponse)
async def approve_user(
    user_id: int,
    current_user: UserMaster = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.role != UserRole.MSR:
        raise HTTPException(status_code=400, detail="Only MSR users can be approved")
    
    return approve_msr_user(db=db, user_id=user_id, approved_by=current_user.user_id)

@router.post("/{user_id}/reject", response_model=UserResponse)
async def reject_user(
    user_id: int,
    reason: str = None,
    current_user: UserMaster = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.role != UserRole.MSR:
        raise HTTPException(status_code=400, detail="Only MSR users can be rejected")
    
    if db_user.onboarding_status == 'approved':
        raise HTTPException(status_code=400, detail="Cannot reject an already approved user")
    
    return reject_msr_user(db=db, user_id=user_id, rejected_by=current_user.user_id, reason=reason)

# GET /users/role/{role} - get users by role
@router.get("/role/{role}", response_model=List[UserResponseWithOnboarder])
async def read_users_by_role(
    role: UserRole,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not can_manage_role(current_user.role, role):
        raise HTTPException(status_code=403, detail=f"Not authorized to view users with role {role}")
    
    if current_user.role == UserRole.ADMIN:
        users = db.query(UserMaster).filter(UserMaster.role == role).all()
    else:
        users = db.query(UserMaster).filter(
            UserMaster.role == role,
            UserMaster.reports_to == current_user.user_id
        ).all()
    
    # Convert to response format with onboarder details
    result = []
    for user in users:
        onboarder = None
        if user.reports_to:
            onboarder_user = get_user(db, user.reports_to)
            if onboarder_user:
                onboarder = OnboarderResponse(
                    name=onboarder_user.name,
                    email=onboarder_user.email,
                    mobile=onboarder_user.mobile,
                    user_id=onboarder_user.user_id
                )
        
        user_response = UserResponseWithOnboarder(
            user_id=user.user_id,
            t_no=user.t_no,
            name=user.name,
            designation=user.designation,
            hq=user.hq,
            responsibility=user.responsibility,
            role=user.role,
            reports_to=user.reports_to,
            status=user.status,
            email=user.email,
            mobile=user.mobile,
            address_line1=user.address_line1,
            address_line2=user.address_line2,
            state=user.state,
            district=user.district,
            pincode=user.pincode,
            location=user.location,
            latitude=user.latitude,
            longitude=user.longitude,
            company_name=user.company_name,
            bank_account_holder=user.bank_account_holder,
            bank_name=user.bank_name,
            bank_account_number=user.bank_account_number,
            bank_ifsc_code=user.bank_ifsc_code,
            vpa_id=user.vpa_id,
            onboarding_status=user.onboarding_status,
            rejection_reason= user.rejection_reason,
            created_at=user.created_at,
            updated_at=user.updated_at,
            onboarder=onboarder
            
        )
        result.append(user_response)
    
    return result

# POST /users/mechanics/nearby - find mechanics near location (only those who report to current user)
@router.post("/mechanics/nearby", response_model=List[int])
async def find_nearby_mechanics(
    request: NearbyMechanicsRequest,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    allowed_roles = [UserRole.MSR, UserRole.STATEHEAD, UserRole.ZONALHEAD, UserRole.ADMIN]
    if current_user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Not authorized to use this feature")

    reports_to_user_id = None if current_user.role == UserRole.ADMIN else current_user.user_id

    mechanics = get_mechanics_near_location(
        db,
        request.latitude,
        request.longitude,
        reports_to_user_id,
        request.max_distance
    )

    return [m.user_id for m in mechanics]  # -> [1, 42, 77]

@router.post("/geocode/reverse", response_model=AddressResponse)
async def reverse_geocode(
    request: Request,
    reverse_request: ReverseGeocodeRequest,
    current_user: UserMaster = Depends(get_current_active_user),
):
    """
    Convert latitude/longitude to address with enhanced accuracy
    """
    try:
        # Use enhanced geocoder
        result = await enhanced_osm_geocoder.reverse_geocode(
            reverse_request.latitude, 
            reverse_request.longitude,
            request
        )
        
        if not result:
            raise HTTPException(
                status_code=404, 
                detail="Could not find address for these coordinates. Try moving to a different location."
            )
        
        # Parse with enhanced parser
        address_data = parse_enhanced_osm_address(result)
        
        # Additional validation
        if not any([address_data.get('address_line1'), address_data.get('district'), address_data.get('state')]):
            raise HTTPException(
                status_code=404,
                detail="Address found but insufficient details. Please try a different location."
            )
        
        return address_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reverse geocoding failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to geocode coordinates")

# Make sure there's proper separation between endpoints
@router.put("/{user_id}/location", response_model=UserResponse)
async def update_user_location(
    user_id: int,
    location_data: UserLocationUpdate,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user location with coordinates and formatted address
    """
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check permissions - users can update their own location or admins can update anyone
    if current_user.role != UserRole.ADMIN and db_user.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user's location")
    
    # Prepare update data
    update_data = location_data.dict(exclude_unset=True)
    update_data['updated_by'] = current_user.user_id
    
    # Update user fields
    for field, value in update_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.put("/me/location", response_model=UserResponse)
async def update_my_location(
    location_data: UserLocationUpdate,
    current_user: UserMaster = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's location with coordinates and formatted address
    (Convenience endpoint for users to update their own location)
    """
    # Prepare update data
    update_data = location_data.dict(exclude_unset=True)
    update_data['updated_by'] = current_user.user_id
    
    # Update user fields
    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user