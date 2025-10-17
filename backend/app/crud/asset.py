# app/crud/asset.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.model.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate
from typing import List, Optional
from datetime import datetime

def get_asset(db: Session, asset_id: int) -> Optional[Asset]:
    return db.query(Asset).filter(Asset.asset_id == asset_id).first()

def get_asset_by_serial_number(db: Session, serial_number: str) -> Optional[Asset]:
    return db.query(Asset).filter(Asset.asset_serial_number == serial_number).first()

def get_assets(db: Session, skip: int = 0, limit: int = 100) -> List[Asset]:
    return db.query(Asset).offset(skip).limit(limit).all()

def get_assets_by_user(db: Session, user_id: int) -> List[Asset]:
    return db.query(Asset).filter(Asset.assigned_to == user_id).all()

def get_assets_by_type(db: Session, asset_type: str) -> List[Asset]:
    return db.query(Asset).filter(Asset.asset_type == asset_type).all()

def create_asset(db: Session, asset: AssetCreate, created_by: int) -> Asset:
    # Check if serial number already exists
    if asset.asset_serial_number:
        existing_asset = get_asset_by_serial_number(db, asset.asset_serial_number)
        if existing_asset:
            raise ValueError("Asset with this serial number already exists")
    
    db_asset = Asset(
        **asset.dict(),
        created_by=created_by,
        updated_by=created_by
    )
    db.add(db_asset)
    try:
        db.commit()
        db.refresh(db_asset)
        return db_asset
    except IntegrityError as e:
        db.rollback()
        if "ix_assets_asset_serial_number" in str(e):
            raise ValueError("Asset with this serial number already exists")
        elif "assets_assigned_to_fkey" in str(e):
            raise ValueError("Invalid user ID provided for assignment")
        else:
            raise ValueError("Database integrity error occurred")

def update_asset(db: Session, asset_id: int, asset: AssetUpdate, updated_by: int) -> Optional[Asset]:
    db_asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not db_asset:
        return None
    
    # Check if serial number is being updated and if it already exists
    if asset.asset_serial_number and asset.asset_serial_number != db_asset.asset_serial_number:
        existing_asset = get_asset_by_serial_number(db, asset.asset_serial_number)
        if existing_asset:
            raise ValueError("Asset with this serial number already exists")
    
    update_data = asset.dict(exclude_unset=True)
    update_data["updated_by"] = updated_by
    
    # If assigning to a user, set allocated_on date
    if "assigned_to" in update_data and update_data["assigned_to"]:
        update_data["allocated_on"] = datetime.utcnow()
        update_data["status"] = "allocated"
    elif "assigned_to" in update_data and update_data["assigned_to"] is None:
        update_data["allocated_on"] = None
        update_data["status"] = "available"
    
    for field, value in update_data.items():
        setattr(db_asset, field, value)
    
    try:
        db.commit()
        db.refresh(db_asset)
        return db_asset
    except IntegrityError as e:
        db.rollback()
        if "ix_assets_asset_serial_number" in str(e):
            raise ValueError("Asset with this serial number already exists")
        elif "assets_assigned_to_fkey" in str(e):
            raise ValueError("Invalid user ID provided for assignment")
        else:
            raise ValueError("Database integrity error occurred")

def delete_asset(db: Session, asset_id: int) -> bool:
    db_asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if db_asset:
        db.delete(db_asset)
        try:
            db.commit()
            return True
        except IntegrityError:
            db.rollback()
            raise ValueError("Cannot delete asset due to database constraints")
    return False

def search_assets(db: Session, search_term: str) -> List[Asset]:
    return db.query(Asset).filter(
        (Asset.asset_name.ilike(f"%{search_term}%")) |
        (Asset.asset_serial_number.ilike(f"%{search_term}%")) |
        (Asset.asset_model.ilike(f"%{search_term}%"))
    ).all()