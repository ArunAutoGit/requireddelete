# app/routes/asset.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.model.asset import Asset as AssetModel
from app.model.usermaster import UserMaster
from app.schemas.asset import AssetCreate, AssetUpdate, Asset, AssetListResponse
from app.crud.asset import (
    get_asset, get_assets, create_asset, update_asset, 
    delete_asset, get_assets_by_user, get_assets_by_type, search_assets
)

router = APIRouter(prefix="/assets", tags=["assets"])

@router.get("/", response_model=AssetListResponse)
def list_assets(
    skip: int = 0,
    limit: int = 100,
    asset_type: Optional[str] = None,
    user_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserMaster = Depends(get_current_user)
):
    try:
        if search:
            assets = search_assets(db, search)
            total = len(assets)
            assets = assets[skip:skip + limit]
        elif asset_type:
            assets = get_assets_by_type(db, asset_type)
            total = len(assets)
            assets = assets[skip:skip + limit]
        elif user_id:
            assets = get_assets_by_user(db, user_id)
            total = len(assets)
            assets = assets[skip:skip + limit]
        else:
            assets = get_assets(db, skip=skip, limit=limit)
            total = db.query(AssetModel).count()
        
        # Add user details to response
        assets_with_details = []
        for asset in assets:
            asset_data = Asset.from_orm(asset)
            if asset.user:
                asset_data.user_name = asset.user.name
                asset_data.user_role = asset.user.role
                asset_data.user_email = asset.user.email
                asset_data.user_mobile = asset.user.mobile
                
            assets_with_details.append(asset_data)
        
        return AssetListResponse(total=total, assets=assets_with_details)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching assets: {str(e)}"
        )

@router.get("/{asset_id}", response_model=Asset)
def get_asset_details(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: UserMaster = Depends(get_current_user)
):
    try:
        asset = get_asset(db, asset_id)
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        asset_data = Asset.from_orm(asset)
        if asset.user:
            asset_data.user_name = asset.user.name
            asset_data.user_role = asset.user.role
            asset_data.user_email = asset.user.email
            asset_data.user_mobile = asset.user.mobile
        
        return asset_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching asset details: {str(e)}"
        )

@router.post("/", response_model=Asset, status_code=status.HTTP_201_CREATED)
def allocate_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: UserMaster = Depends(get_current_user)
):
    try:
        # If assigning to user, set allocated_on date
        if asset.assigned_to:
            asset_data = asset.dict()
            asset_data["allocated_on"] = datetime.utcnow()
            asset_data["status"] = "allocated"
            asset = AssetCreate(**asset_data)
        
        db_asset = create_asset(db, asset, current_user.user_id)
        
        # Add user details to response
        asset_data = Asset.from_orm(db_asset)
        if db_asset.user:
            asset_data.user_name = db_asset.user.name
            asset_data.user_role = db_asset.user.role
            asset_data.user_email = db_asset.user.email
            asset_data.user_mobile = db_asset.user.mobile
        
        return asset_data
        
    except ValueError as e:
        if "serial number already exists" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset with this serial number already exists"
            )
        elif "invalid user id" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID provided for assignment"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating asset: {str(e)}"
        )

@router.put("/{asset_id}", response_model=Asset)
def update_asset_details(
    asset_id: int,
    asset: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: UserMaster = Depends(get_current_user)
):
    try:
        db_asset = update_asset(db, asset_id, asset, current_user.user_id)
        if not db_asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        # Add user details to response
        asset_data = Asset.from_orm(db_asset)
        if db_asset.user:
            asset_data.user_name = db_asset.user.name
            asset_data.user_role = db_asset.user.role
            asset_data.user_email = db_asset.user.email
            asset_data.user_mobile = db_asset.user.mobile
        
        return asset_data
        
    except ValueError as e:
        if "serial number already exists" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset with this serial number already exists"
            )
        elif "invalid user id" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID provided for assignment"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating asset: {str(e)}"
        )

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset_record(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: UserMaster = Depends(get_current_user)
):
    try:
        success = delete_asset(db, asset_id)
        if not success:
            raise HTTPException(status_code=404, detail="Asset not found")
        return None
        
    except ValueError as e:
        if "database constraints" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot delete asset due to existing references"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting asset: {str(e)}"
        )