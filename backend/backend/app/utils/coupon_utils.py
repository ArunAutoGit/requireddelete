from sqlalchemy.orm import Session
from app.model.couponbatch import CouponBatch
from app.model.productmaster import ProductMaster

class CouponUtils:
    
    @staticmethod
    def get_coupon_details(db: Session, batch_id: int):
        """Get batch and product details for coupon"""
        batch = db.query(CouponBatch).filter(
            CouponBatch.batch_id == batch_id
        ).first()
        
        if not batch:
            return None, None
        
        product = db.query(ProductMaster).filter(
            ProductMaster.product_id == batch.product_id
        ).first()
        
        return batch, product