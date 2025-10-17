# app/services/printer_report_service.py
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.model import CouponBatch, ProductMaster, CouponLabel
from typing import List, Optional
from datetime import datetime

class ReportService:
    
    @staticmethod
    def get_printer_report(
        db: Session, 
        user_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List:
        """
        Get printer report data using SQL JOIN for maximum efficiency
        """
        query = (
            select(
                CouponBatch.batch_id.label("reference_batch_id"),
                CouponBatch.printed_by.label("user_id"),
                ProductMaster.product_name.label("part_name"),
                CouponBatch.quantity.label("batch_quantity"),
                CouponBatch.printed_date.label("printed_on")
            )
            .join(ProductMaster, CouponBatch.product_id == ProductMaster.product_id)
            .where(CouponBatch.printed_by == user_id)
            .where(CouponBatch.status == "PRINTED")
        )
        
        # Apply date filters if provided
        if start_date:
            query = query.where(CouponBatch.printed_date >= start_date)
        if end_date:
            query = query.where(CouponBatch.printed_date <= end_date)
        
        # Order by printed date descending (most recent first)
        query = query.order_by(CouponBatch.printed_date.desc())
        
        # Apply pagination
        if limit > 0:
            query = query.offset(skip).limit(limit)
        
        result = db.execute(query).all()
        return result
    
    @staticmethod
    def get_printer_total_count(
        db: Session,
        user_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> int:
        """
        Get total count of printed batches for pagination
        """
        query = (
            select(func.count(CouponBatch.batch_id))
            .where(CouponBatch.printed_by == user_id)
            .where(CouponBatch.status == "PRINTED")
        )
        
        if start_date:
            query = query.where(CouponBatch.printed_date >= start_date)
        if end_date:
            query = query.where(CouponBatch.printed_date <= end_date)
        
        return db.execute(query).scalar()
    
    @staticmethod
    def get_coupon_report(
        db: Session, 
        user_id: int,
        batch_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        coupon_status: Optional[str] = None,  # Renamed to avoid confusion
        skip: int = 0,
        limit: int = 100
    ) -> List:
        """
        Get coupon report data filtered by user who created the batches
        AND only include batches that have been printed (status = PRINTED)
        """
        query = (
            select(
                CouponLabel.batch_id.label("unique_batch_id"),
                CouponLabel.unique_num.label("coupon_unique_number"),
                ProductMaster.part_no.label("part_number"),
                ProductMaster.mechanic_coupon_inner.label("amount")
            )
            .join(CouponBatch, CouponLabel.batch_id == CouponBatch.batch_id)
            .join(ProductMaster, CouponBatch.product_id == ProductMaster.product_id)
            .where(CouponBatch.created_by == user_id)  # Filter by user who created the batch
            .where(CouponBatch.status == "PRINTED")    # Only include printed batches
        )
        
        # Apply additional filters
        if batch_id:
            query = query.where(CouponLabel.batch_id == batch_id)
        if coupon_status:
            query = query.where(CouponLabel.status == coupon_status)  # Coupon status filter
        if start_date:
            query = query.where(CouponLabel.created_at >= start_date)
        if end_date:
            query = query.where(CouponLabel.created_at <= end_date)
        
        # Order by batch ID and unique number
        query = query.order_by(CouponLabel.batch_id.desc(), CouponLabel.unique_num)
        
        # Apply pagination
        if limit > 0:
            query = query.offset(skip).limit(limit)
        
        result = db.execute(query).all()
        return result
    
    @staticmethod
    def get_coupon_total_count(
        db: Session,
        user_id: int,
        batch_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        coupon_status: Optional[str] = None
    ) -> int:
        """
        Get total count of coupons created by the user from printed batches
        """
        query = (
            select(func.count(CouponLabel.coupon_id))
            .join(CouponBatch, CouponLabel.batch_id == CouponBatch.batch_id)
            .where(CouponBatch.created_by == user_id)  # Filter by user who created the batch
            .where(CouponBatch.status == "PRINTED")    # Only include printed batches
        )
        
        if batch_id:
            query = query.where(CouponLabel.batch_id == batch_id)
        if coupon_status:
            query = query.where(CouponLabel.status == coupon_status)
        if start_date:
            query = query.where(CouponLabel.created_at >= start_date)
        if end_date:
            query = query.where(CouponLabel.created_at <= end_date)
        
        return db.execute(query).scalar()