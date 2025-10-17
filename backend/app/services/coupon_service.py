from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import random
import string
from app.model.couponbatch import CouponBatch
from app.model.couponlabel import CouponLabel
from app.model.productmaster import ProductMaster
from app.schemas.coupon import CouponBatchCreate
from app.schemas.user import UserRole
from typing import List
from fastapi import HTTPException
from io import BytesIO
from app.services.qr_service import QRCodeService
from app.schemas.coupon import ProductPrintData, QRCodePrintData, BatchPrintResponse
from datetime import datetime


class CouponService:
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_batch_id(self) -> int:
        """Generate batch ID in format DDMM001"""
        now = datetime.now()
        date_part = now.strftime("%d%m")  # DDMM
        
        # Count batches created today
        today_start = datetime(now.year, now.month, now.day)
        batch_count = (
            self.db.query(func.count(CouponBatch.batch_id))
            .filter(CouponBatch.created_at >= today_start)
            .scalar() or 0
        )
        
        sequence = batch_count + 1
        return int(f"{date_part}{sequence:03d}")
    
    def generate_qr_prefix(self) -> str:
        """Generate random 2-character prefix for QR codes"""
        return ''.join(random.choices(string.ascii_uppercase, k=2))
    
    def generate_unique_num(self, batch_id: int, sequence: int) -> str:
        """Generate unique number in format DDMMYYHHMMSSID001"""
        now = datetime.now()
        timestamp_part = now.strftime("%d%m%y%H%M%S")  # DDMMYYHHMMSS
        
        # Use last 2 digits of batch_id as ID part
        id_part = str(batch_id)[-2:].zfill(2)
        seq_part = str(sequence).zfill(3)
        
        return f"{timestamp_part}{id_part}{seq_part}"
    
    def generate_encrypted_token(self, unique_num: str) -> str:
        """Generate encrypted token for QR code without URL prefix"""
        import base64
        from datetime import datetime
        
        # Create token data (unique_num + timestamp for uniqueness)
        token_data = f"coupon_{unique_num}_{datetime.now().timestamp()}"
        
        # Encode to base64 (URL-safe version)
        encrypted_token = base64.urlsafe_b64encode(token_data.encode()).decode()
        
        return encrypted_token

    
    def create_coupon_batch(self, batch_data: CouponBatchCreate, current_user_id: int) -> CouponBatch:

        """Create a new coupon batch with labels using product's coupon value"""
        
        # Verify product exists and has coupon value
        product = self.db.query(ProductMaster).filter(
            ProductMaster.product_id == batch_data.product_id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product.mechanic_coupon_inner is None or product.mechanic_coupon_inner <= 0:
            raise HTTPException(
                status_code=400, 
                detail="Product does not have a valid coupon value"
            )
        
        # Generate batch ID and QR prefix
        batch_id = self.generate_batch_id()
        qr_prefix = self.generate_qr_prefix()
        coupon_value = float(product.mechanic_coupon_inner)
        total_cost = batch_data.quantity * coupon_value
        
        # Create batch record
        db_batch = CouponBatch(
            batch_id=batch_id,
            product_id=batch_data.product_id,
            quantity=batch_data.quantity,
            coupon_value=coupon_value,  # Use product's coupon value
            qr_prefix=qr_prefix,
            total_cost=total_cost,
            status="GENERATED",
            created_at=datetime.now(),
            created_by=current_user_id  # Set from authenticated user
        )
        
        self.db.add(db_batch)
        
        # Generate coupon labels
        for i in range(1, batch_data.quantity + 1):
            unique_num = self.generate_unique_num(batch_id, i)
            encrypted_token = self.generate_encrypted_token(unique_num)
            
            db_label = CouponLabel(
                batch_id=batch_id,
                qr_code=encrypted_token,
                unique_num=unique_num,
                status="ACTIVE",
                created_at=datetime.now(),
                created_by=current_user_id  # Set from authenticated user
            )
            
            self.db.add(db_label)
        
        self.db.commit()
        self.db.refresh(db_batch)
        
        return db_batch
    
    def get_batch_by_id(self, batch_id: int) -> CouponBatch:
        """Get batch by ID with product details"""
        return (
            self.db.query(CouponBatch)
            .filter(CouponBatch.batch_id == batch_id)
            .first()
        )
    
    def get_batch_labels(self, batch_id: int) -> List[CouponLabel]:
        """Get all labels for a batch"""
        return (
            self.db.query(CouponLabel)
            .filter(CouponLabel.batch_id == batch_id)
            .order_by(CouponLabel.coupon_id)
            .all()
        )
    
    def mark_batch_printed(self, batch_id: int, current_user_id: int) -> CouponBatch:
        """Mark batch as printed - only allowed for PRINTER role"""
        db_batch = self.get_batch_by_id(batch_id)
        if not db_batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        db_batch.status = "PRINTED"
        db_batch.printed_by = current_user_id  # Set from authenticated user
        db_batch.printed_date = datetime.now()
        db_batch.updated_at = datetime.now()
        
        self.db.commit()
        self.db.refresh(db_batch)
        return db_batch
    
    def get_batch_with_qr_codes(self, batch_id: int) -> dict:
        """Get batch details with QR code data for printing"""
        batch = self.get_batch_by_id(batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        labels = self.get_batch_labels(batch_id)
        
        # Get product details
        product = self.db.query(ProductMaster).filter(
            ProductMaster.product_id == batch.product_id
        ).first()
        
        return {
            "batch": batch,
            "labels": labels,
            "product_details": {
                "product_name": product.product_name,
                "part_no": product.part_no,
                "grade": product.grade,
                "size": product.size,
                "cell": product.cell,
                "coupon_value": product.mechanic_coupon_inner
            } if product else None,
            "qr_codes": [
                {
                    "unique_num": label.unique_num,
                    "qr_code": label.qr_code,
                    "status": label.status
                }
                for label in labels
            ]
        }
    
    def generate_qr_images(self, batch_id: int) -> list:
        """Generate QR code images for a batch WITHOUT text"""
        qr_service = QRCodeService()
        labels = self.get_batch_labels(batch_id)
        
        qr_images = []
        for label in labels:
            # Generate redeem URL
            redeem_url = qr_service.generate_redeem_url(label.qr_code)
            
            # Generate QR code image WITHOUT text - use generate_qr_image instead of generate_qr_with_text
            qr_buffer = qr_service.generate_qr_image(redeem_url)  # Changed this line
            
            # Convert to base64 for API response
            qr_base64 = qr_service.qr_image_to_base64(qr_buffer)
            
            qr_images.append({
                "coupon_id": label.coupon_id,
                "unique_num": label.unique_num,
                "qr_code_base64": qr_base64,
                "redeem_url": redeem_url,
                "status": label.status
            })
        
        return qr_images

    def get_printable_batch_data(self, batch_id: int) -> dict:
        """Get all data needed for printing labels"""
        batch = self.get_batch_by_id(batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        # Get product details
        product = self.db.query(ProductMaster).filter(
            ProductMaster.product_id == batch.product_id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Generate QR images
        qr_images = self.generate_qr_images(batch_id)
        
        return {
            "batch": {
                "batch_id": batch.batch_id,
                "quantity": batch.quantity,
                "coupon_value": batch.coupon_value,
                "total_cost": batch.total_cost,
                "created_at": batch.created_at
            },
            "product": {
                "product_name": product.product_name,
                "part_no": product.part_no,
                "grade": product.grade,
                "size": product.size,
                "cell": product.cell,
                "vehicle_application": product.vehicle_application,
                "barcode": product.barcode
            },
            "qr_codes": qr_images
        }
    
    def get_batch_print_data(self, batch_id: int) -> BatchPrintResponse:
        """Get complete print data for a batch including product details and QR codes"""
        batch = self.get_batch_by_id(batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        # Get product details
        product = self.db.query(ProductMaster).filter(
            ProductMaster.product_id == batch.product_id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Format PKD date
        pkd_date = self._calculate_pkd_date(product)
        
        # Get all QR codes for this batch
        labels = self.get_batch_labels(batch_id)
        qr_codes = []
        
        for label in labels:
            # Generate QR code image for each label WITHOUT text
            qr_service = QRCodeService()
            redeem_url = qr_service.generate_redeem_url(label.qr_code)
            qr_buffer = qr_service.generate_qr_image(redeem_url)  # Changed this line
            qr_base64 = qr_service.qr_image_to_base64(qr_buffer)
            
            qr_codes.append(QRCodePrintData(
                coupon_id=label.coupon_id,
                unique_num=label.unique_num,
                qr_code_base64=qr_base64,
                status=label.status
            ))
        
        # Prepare product data
        product_data = ProductPrintData(
            product_name=product.product_name,
            part_no=product.part_no,
            grade=product.grade,
            net_qty_inner=product.net_qty_inner,
            size1=product.size1,
            pkd_date=pkd_date,
            mrp_inner=product.mrp_inner,
            mechanic_coupon_inner=product.mechanic_coupon_inner
        )
        
        return BatchPrintResponse(
            batch_id=batch.batch_id,
            product=product_data,
            qr_codes=qr_codes,
            total_quantity=batch.quantity,
            generated_at=batch.created_at
        )

    def _calculate_pkd_date(self, product) -> str:
        """Calculate PKD date - you can customize this based on your business logic"""
        # Example: 6 months from now
        from dateutil.relativedelta import relativedelta
        future_date = datetime.now() + relativedelta(months=+6)
        return future_date.strftime("%b %Y").upper()  # Format: "JUL 2025"
    
    def get_available_batches(self) -> List[CouponBatch]:
        """Get all batches that are not printed, ordered by newest first"""
        return (
            self.db.query(CouponBatch)
            .filter(CouponBatch.status != "PRINTED")  # Get batches that are not printed
            .order_by(CouponBatch.created_at.desc())  # Newest first
            .all()
        )

    def get_available_batches_with_details(self) -> List[dict]:
        """Get all batches that are not printed with product details, ordered by newest first"""
        batches = (
            self.db.query(CouponBatch)
            .filter(CouponBatch.status != "PRINTED")
            .order_by(CouponBatch.created_at.desc())
            .all()
        )
        
        result = []
        for batch in batches:
            # Get product details
            product = self.db.query(ProductMaster).filter(
                ProductMaster.product_id == batch.product_id
            ).first()
            
            batch_data = {
                "batch_id": batch.batch_id,
                "product_id": batch.product_id,
                "quantity": batch.quantity,
                "coupon_value": float(batch.coupon_value),
                "qr_prefix": batch.qr_prefix,
                "total_cost": float(batch.total_cost),
                "status": batch.status,
                "created_at": batch.created_at,
                "created_by": batch.created_by,
                "product_details": {
                    "product_name": product.product_name if product else None,
                    "part_no": product.part_no if product else None,
                    "grade": product.grade if product else None
                } if product else None
            }
            result.append(batch_data)
        
        return result
