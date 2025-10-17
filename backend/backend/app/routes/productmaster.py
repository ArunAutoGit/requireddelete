from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.crud import productmaster as crud
from app.schemas.productmaster import ProductMasterCreate, ProductMasterOut, ProductMasterUpdate
from app.core.database import SessionLocal, engine
from app.dependencies.auth import get_current_active_user, require_role, require_any_role
from app.model.usermaster import UserMaster
import pandas as pd
from io import BytesIO
from urllib.parse import unquote

router = APIRouter(prefix="/productmaster", tags=["ProductMaster"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create single product (manual) - ADMIN only
@router.post("/", response_model=ProductMasterOut)
def create_product(
    product: ProductMasterCreate, 
    current_user: UserMaster = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return crud.create_product(db, product)

# Bulk create from Excel - ADMIN only
@router.post("/upload_excel/", response_model=List[ProductMasterOut])
async def upload_excel(
    file: UploadFile = File(...),
    current_user: UserMaster = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only Excel files (.xlsx, .xls) are allowed"
        )
    
    try:
        # Read the file content into memory
        content = await file.read()
        
        # Check if file is empty
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty"
            )
        
        # Create a BytesIO object from the content
        excel_data = BytesIO(content)
        
        # Read the Excel file from BytesIO
        df = pd.read_excel(excel_data)
        
        products = []
        for _, row in df.iterrows():
            # Convert NaN to None for optional fields
            def clean_value(value, dtype):
                if pd.isna(value):
                    return None
                if dtype == 'str':
                    return str(value) if pd.notna(value) else None
                elif dtype == 'int':
                    try:
                        return int(value) if pd.notna(value) else None
                    except (ValueError, TypeError):
                        return None
                elif dtype == 'float':
                    try:
                        return float(value) if pd.notna(value) else None
                    except (ValueError, TypeError):
                        return None
                elif dtype == 'bool':
                    if pd.isna(value):
                        return False
                    if isinstance(value, bool):
                        return value
                    if isinstance(value, (int, float)):
                        return bool(value)
                    if isinstance(value, str):
                        return value.lower() in ('true', 'yes', '1', 'y')
                    return False
                return value

            product_data = ProductMasterCreate(
                sl_no=clean_value(row.get("sl_no"), 'int'),
                location=clean_value(row.get("location"), 'str'),
                cell=clean_value(row.get("cell"), 'str'),
                vehicle_application=clean_value(row.get("vehicle_application"), 'str'),
                segment_product=clean_value(row.get("segment_product"), 'str'),
                product_name=clean_value(row.get("product_name"), 'str'),
                part_no=clean_value(row.get("part_no"), 'str'),
                grade=clean_value(row.get("grade"), 'str'),
                size=clean_value(row.get("size"), 'str'),
                net_qty_inner=clean_value(row.get("net_qty_inner"), 'int'),
                net_qty_master=clean_value(row.get("net_qty_master"), 'int'),
                size1=clean_value(row.get("size1"), 'str'),
                mechanic_coupon_inner=clean_value(row.get("mechanic_coupon_inner"), 'float'),
                mrp_inner=clean_value(row.get("mrp_inner"), 'float'),
                mrp_master=clean_value(row.get("mrp_master"), 'float'),
                barcode=clean_value(row.get("barcode"), 'str'),
                prd_code=clean_value(row.get("prd_code"), 'str'),
                padi_cell=clean_value(row.get("padi_cell"), 'str'),
                tskp1_cell=clean_value(row.get("tskp1_cell"), 'str'),
                tskp2_cell=clean_value(row.get("tskp2_cell"), 'str'),
                lbl_status=clean_value(row.get("lbl_status"), 'bool'),
            )
            
            # Create product in database
            product = crud.create_product(db, product_data)
            products.append(product)
        
        return products
    
    except HTTPException:
        raise
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Excel file is empty or contains no data"
        )
    except pd.errors.ParserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Excel file format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing Excel file: {str(e)}"
        )

@router.get("/", response_model=List[ProductMasterOut])
def list_products(
    skip: int = 0, 
    limit: int = 100, 
    current_user: UserMaster = Depends(require_any_role(["admin", "printer"])),
    db: Session = Depends(get_db)
):
    location_filter = None
    if current_user.role == "printer" and current_user.location:
        location_filter = current_user.location
    
    # Use partial matching for location
    return crud.get_products(db, skip=skip, limit=limit, location=location_filter)

# Get single product by ID - ADMIN and PRINTER can access
@router.get("/{product_id}", response_model=ProductMasterOut)
def get_product(
    product_id: int, 
    current_user: UserMaster = Depends(require_any_role(["admin", "printer"])),
    db: Session = Depends(get_db)
):
    db_product = crud.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# Update product (partial update) - ADMIN only
@router.patch("/{product_id}", response_model=ProductMasterOut)
def update_product(
    product_id: int, 
    updates: ProductMasterUpdate, 
    current_user: UserMaster = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    db_product = crud.update_product(db, product_id, updates)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# Delete single product - ADMIN only
@router.delete("/{product_id}")
def delete_product(
    product_id: int, 
    current_user: UserMaster = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    db_product = crud.delete_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Bulk delete products - ADMIN only (POST version)
@router.post("/bulk-delete/")
def bulk_delete_products(
    request: dict,  # Accept the request body as a dictionary
    current_user: UserMaster = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    # Extract product_ids from the request body
    product_ids = request.get("product_ids", [])
    
    if not product_ids:
        raise HTTPException(status_code=400, detail="No product IDs provided")
    
    result = crud.delete_products(db, product_ids)
    if result == 0:
        raise HTTPException(status_code=404, detail="No products found to delete")
    return {"message": f"{result} products deleted successfully"}