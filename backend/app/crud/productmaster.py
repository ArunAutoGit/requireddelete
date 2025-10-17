from typing import List, Optional
from sqlalchemy.orm import Session
from app.model.productmaster import ProductMaster
from app.schemas.productmaster import ProductMasterCreate, ProductMasterUpdate
from sqlalchemy import func
from sqlalchemy import or_ 

# Create product (single) - Auto-generate sl_no if not provided
def create_product(db: Session, product: ProductMasterCreate):
    # Auto-generate sl_no if not provided
    product_data = product.dict()
    if product_data.get('sl_no') is None:
        # Get the maximum sl_no and increment by 1
        max_sl_no = db.query(func.max(ProductMaster.sl_no)).scalar() or 0
        product_data['sl_no'] = max_sl_no + 1
    
    db_product = ProductMaster(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Get product by ID
def get_product(db: Session, product_id: int):
    return db.query(ProductMaster).filter(ProductMaster.product_id == product_id).first()

# Get product by sl_no
def get_product_by_sl_no(db: Session, sl_no: int):
    return db.query(ProductMaster).filter(ProductMaster.sl_no == sl_no).first()

# Get all products with optional location filter (partial matching)
def get_products(db: Session, skip: int = 0, limit: int = 100, location: Optional[str] = None):
    query = db.query(ProductMaster).order_by(ProductMaster.sl_no)
    
    # Add location filter if provided
    if location:
        # Use ILIKE for case-insensitive partial matching
        # This will match any location that contains the search string
        query = query.filter(ProductMaster.location.ilike(f"%{location}%"))
    
    return query.offset(skip).limit(limit).all()

# Update product - only changed fields
def update_product(db: Session, product_id: int, updates: ProductMasterUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

# Delete product
def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product

# Bulk delete products
def delete_products(db: Session, product_ids: List[int]):
    result = db.query(ProductMaster).filter(ProductMaster.product_id.in_(product_ids)).delete()
    db.commit()
    return result