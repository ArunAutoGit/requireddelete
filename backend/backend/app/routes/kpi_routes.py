# app/api/kpi_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.model.couponlabel import CouponLabel
from app.model.couponbatch import CouponBatch
from app.model.usermaster import UserMaster
from app.model.productmaster import ProductMaster

router = APIRouter()

@router.get("/kpi/msr/{user_id}")
async def msr_kpis(user_id: int, db: Session = Depends(get_db)):
    """Get all KPIs for MSR role in a single response"""
    
    # Total Scanned Coupons
    total_scanned = db.query(func.count(CouponLabel.coupon_id)).filter(
        CouponLabel.scanned_by == user_id,
        CouponLabel.status == "SCANNED"
    ).scalar() or 0
    
    # Total Amount from scanned coupons
    total_amount_subquery = db.query(func.sum(CouponBatch.coupon_value)).join(
        CouponLabel, CouponLabel.batch_id == CouponBatch.batch_id
    ).filter(
        CouponLabel.scanned_by == user_id,
        CouponLabel.status == "SCANNED"
    ).scalar() or 0
    
    return {
        "total_scanned": total_scanned,
        "total_amount": float(total_amount_subquery) if total_amount_subquery else 0
    }

@router.get("/kpi/statehead/{user_id}")
async def statehead_kpis(user_id: int, db: Session = Depends(get_db)):
    """Get all KPIs for Statehead/Zonalhead role in a single response"""
    
    # Total Scanned Coupons (individual)
    total_scanned = db.query(func.count(CouponLabel.coupon_id)).filter(
        CouponLabel.scanned_by == user_id,
        CouponLabel.status == "SCANNED"
    ).scalar() or 0
    
    # Total Amount from scanned coupons (individual)
    total_amount_subquery = db.query(func.sum(CouponBatch.coupon_value)).join(
        CouponLabel, CouponLabel.batch_id == CouponBatch.batch_id
    ).filter(
        CouponLabel.scanned_by == user_id,
        CouponLabel.status == "SCANNED"
    ).scalar() or 0
    
    # Pending MSR Approvals
    pending_msr_approvals = db.query(func.count(UserMaster.user_id)).filter(
        UserMaster.reports_to == user_id,
        UserMaster.role == "msr",
        UserMaster.status == False
    ).scalar() or 0
    
    return {
        "total_scanned_territory": total_scanned,
        "total_amount_territory": float(total_amount_subquery) if total_amount_subquery else 0,
        "pending_msr_approvals": pending_msr_approvals
    }

@router.get("/kpi/printer/{user_id}")
async def printer_kpis(user_id: int, db: Session = Depends(get_db)):
    """Get all KPIs for Printer role in a single response"""
    
    # Total QR Generated - count all labels in batches created by this printer
    total_qr_generated = db.query(func.count(CouponLabel.coupon_id)).join(
        CouponBatch, CouponLabel.batch_id == CouponBatch.batch_id
    ).filter(
        CouponBatch.created_by == user_id
    ).scalar() or 0
    
    # Printed Batches
    printed_batches = db.query(func.count(CouponBatch.batch_id)).filter(
        CouponBatch.printed_by == user_id,
        CouponBatch.status == "PRINTED"
    ).scalar() or 0
    
    # Pending Printing
    pending_printing = db.query(func.count(CouponBatch.batch_id)).filter(
        CouponBatch.created_by == user_id,
        CouponBatch.status == "GENERATED"
    ).scalar() or 0
    
    return {
        "total_qr_generated": total_qr_generated,
        "printed_batches": printed_batches,
        "pending_printing": pending_printing
    }

@router.get("/kpi/admin")
async def admin_kpis(db: Session = Depends(get_db)):
    """Get all KPIs for Admin role in a single response"""
    
    # Total Approved Users (MSR only)
    total_approved_msr = db.query(func.count(UserMaster.user_id)).filter(
        UserMaster.status == True,
        UserMaster.role == "msr"
    ).scalar() or 0
    
    # Pending Approvals (MSR only)
    pending_msr_approvals = db.query(func.count(UserMaster.user_id)).filter(
        UserMaster.status == False,
        UserMaster.role == "msr"
    ).scalar() or 0
    
    # Total Products
    total_products = db.query(func.count(ProductMaster.product_id)).scalar() or 0
    
    return {
        "total_approved_msr": total_approved_msr,
        "pending_msr_approvals": pending_msr_approvals,
        "total_products": total_products
    }