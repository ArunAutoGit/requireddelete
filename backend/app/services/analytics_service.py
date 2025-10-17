# app/services/analytics_service.py
from typing import Optional, Tuple
from app.schemas.analytics import StateHeatmapItem, StateHeatmapResponse, StateHeatmapSummary
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, text, case, Float, or_
from datetime import date, timedelta
from app.model.couponlabel import CouponLabel
from app.model.usermaster import UserMaster


class AnalyticsService:
    
    @staticmethod
    def calculate_date_range(
        date_range: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Tuple[date, date]:
        """
        Calculate date range based on predefined options or custom dates
        """
        today = date.today()
        
        # If custom dates provided, use them
        if start_date and end_date:
            return start_date, end_date
        
        # If predefined range provided
        if date_range:
            if date_range == 'last24h':
                start_date = today - timedelta(days=1)
                end_date = today
            elif date_range == 'last7d':
                start_date = today - timedelta(days=7)
                end_date = today
            elif date_range == 'last15d':
                start_date = today - timedelta(days=15)
                end_date = today
            elif date_range == 'last30d':
                start_date = today - timedelta(days=30)
                end_date = today
            elif date_range == 'last90d':
                start_date = today - timedelta(days=90)
                end_date = today
            else:
                raise ValueError(f"Invalid date_range: {date_range}. Use: last24h, last7d, last15d, last30d, last90d")
            
            return start_date, end_date
        
        # Default: last 30 days
        return today - timedelta(days=30), today
    
    @staticmethod
    def _get_hierarchy_filter(msr_id: Optional[int] = None, 
                            statehead_id: Optional[int] = None, 
                            zonalhead_id: Optional[int] = None):
        """
        Create hierarchy filter based on user roles
        """
        filters = []
        
        if msr_id:
            filters.append(UserMaster.reports_to == msr_id)
        
        if statehead_id:
            filters.append(UserMaster.state_head_id == statehead_id)
        
        if zonalhead_id:
            filters.append(UserMaster.zone_head_id == zonalhead_id)
        
        return or_(*filters) if filters else None
    
    @staticmethod
    def get_state_heatmap_data(
        db: Session,
        start_date: date,
        end_date: date,
        state: Optional[str] = None,
        mechanic_id: Optional[int] = None,
        dealer_id: Optional[int] = None,
        stockist_id: Optional[int] = None,
        msr_id: Optional[int] = None,
        statehead_id: Optional[int] = None,
        zonalhead_id: Optional[int] = None
    ) -> StateHeatmapResponse:
        """
        Get state-wise scanning statistics for heatmap visualization
        using mechanic_id_at_scan's state
        """
        # Build base query - Using mechanic_id_at_scan for both counting and filtering
        query = db.query(
            UserMaster.state,
            func.count(CouponLabel.coupon_id).label('scanned_count'),
            func.count(distinct(CouponLabel.mechanic_id_at_scan)).label('unique_mechanics'),
            case(
                (func.count(distinct(func.date(CouponLabel.scanned_on))) > 0,
                 func.count(CouponLabel.coupon_id) / func.count(distinct(func.date(CouponLabel.scanned_on)))),
                else_=0.0
            ).cast(Float).label('average_daily_scans')
        ).join(
            UserMaster, CouponLabel.mechanic_id_at_scan == UserMaster.user_id   # changed join to mechanic_id_at_scan
        ).filter(
            CouponLabel.status == 'SCANNED',
            func.date(CouponLabel.scanned_on) >= start_date,
            func.date(CouponLabel.scanned_on) <= end_date
        )
        
        # Apply basic filters
        if state:
            query = query.filter(UserMaster.state == state)
        
        if mechanic_id:
            query = query.filter(CouponLabel.mechanic_id_at_scan == mechanic_id)
        
        if dealer_id:
            query = query.filter(UserMaster.dealer_id == dealer_id)
        
        if stockist_id:
            query = query.filter(UserMaster.stockist_id == stockist_id)
        
        # Apply hierarchy filters
        hierarchy_filter = AnalyticsService._get_hierarchy_filter(
            msr_id, statehead_id, zonalhead_id
        )
        if hierarchy_filter:
            query = query.filter(hierarchy_filter)
        
        # Group by state
        query = query.group_by(UserMaster.state)
        
        # Execute query
        results = query.all()
        
        if not results:
            return StateHeatmapResponse(
                data=[],
                summary=StateHeatmapSummary(
                    total_scanned=0,
                    total_states=0,
                    total_mechanics=0,
                    time_period=f"{start_date} to {end_date}"
                )
            )
        
        # Calculate max count for intensity normalization
        max_count = max(result.scanned_count for result in results) if results else 1
        
        # Prepare response data
        heatmap_items = []
        for result in results:
            scan_intensity = result.scanned_count / max_count if max_count > 0 else 0
            
            heatmap_items.append(StateHeatmapItem(
                state=result.state or 'Unknown',
                scanned_count=result.scanned_count,
                unique_mechanics=result.unique_mechanics,
                scan_intensity=round(scan_intensity, 2),
                average_daily_scans=round(float(result.average_daily_scans or 0), 1)
            ))
        
        # Calculate summary statistics
        total_scanned = sum(item.scanned_count for item in heatmap_items)
        total_mechanics = sum(item.unique_mechanics for item in heatmap_items)
        total_states = len(heatmap_items)
        
        return StateHeatmapResponse(
            data=heatmap_items,
            summary=StateHeatmapSummary(
                total_scanned=total_scanned,
                total_states=total_states,
                total_mechanics=total_mechanics,
                time_period=f"{start_date} to {end_date}"
            )
        )

    @staticmethod
    def get_state_heatmap_data_optimized(
        db: Session,
        start_date: date,
        end_date: date,
        state: Optional[str] = None,
        mechanic_id: Optional[int] = None,
        dealer_id: Optional[int] = None,
        stockist_id: Optional[int] = None,
        msr_id: Optional[int] = None,
        statehead_id: Optional[int] = None,
        zonalhead_id: Optional[int] = None
    ) -> StateHeatmapResponse:
        """
        Alternative optimized version using raw SQL for better performance
        Uses mechanic_id_at_scan's state
        """
        # Base SQL query with safe average calculation
        sql = """
        SELECT 
            um.state,
            COUNT(cl.coupon_id) as scanned_count,
            COUNT(DISTINCT cl.mechanic_id_at_scan) as unique_mechanics,
            CASE 
                WHEN COUNT(DISTINCT DATE(cl.scanned_on)) > 0 
                THEN COUNT(cl.coupon_id)::float / COUNT(DISTINCT DATE(cl.scanned_on))
                ELSE 0.0 
            END as average_daily_scans
        FROM couponlabel cl
        JOIN usermaster um ON cl.mechanic_id_at_scan = um.user_id   -- changed join to mechanic_id_at_scan
        WHERE cl.status = 'SCANNED'
        AND cl.scanned_on::date BETWEEN :start_date AND :end_date
        """
        
        # Add filters
        params = {"start_date": start_date, "end_date": end_date}
        
        if state:
            sql += " AND um.state = :state"
            params["state"] = state
        
        if mechanic_id:
            sql += " AND cl.mechanic_id_at_scan = :mechanic_id"
            params["mechanic_id"] = mechanic_id
        
        if dealer_id:
            sql += " AND um.dealer_id = :dealer_id"
            params["dealer_id"] = dealer_id
        
        if stockist_id:
            sql += " AND um.stockist_id = :stockist_id"
            params["stockist_id"] = stockist_id
        
        # Add hierarchy filters
        if msr_id:
            sql += " AND um.reports_to = :msr_id"
            params["msr_id"] = msr_id
        
        if statehead_id:
            sql += " AND um.state_head_id = :statehead_id"
            params["statehead_id"] = statehead_id
        
        if zonalhead_id:
            sql += " AND um.zone_head_id = :zonalhead_id"
            params["zonalhead_id"] = zonalhead_id
        
        sql += " GROUP BY um.state ORDER BY scanned_count DESC"
        
        # Execute raw SQL
        results = db.execute(text(sql), params).fetchall()
        
        if not results:
            return StateHeatmapResponse(
                data=[],
                summary=StateHeatmapSummary(
                    total_scanned=0,
                    total_states=0,
                    total_mechanics=0,
                    time_period=f"{start_date} to {end_date}"
                )
            )
        
        # Calculate max count for intensity normalization
        max_count = max(result.scanned_count for result in results) if results else 1
        
        # Prepare response data
        heatmap_items = []
        for result in results:
            scan_intensity = result.scanned_count / max_count if max_count > 0 else 0
            
            heatmap_items.append(StateHeatmapItem(
                state=result.state or 'Unknown',
                scanned_count=result.scanned_count,
                unique_mechanics=result.unique_mechanics,
                scan_intensity=round(scan_intensity, 2),
                average_daily_scans=round(float(result.average_daily_scans or 0), 1)
            ))
        
        # Calculate summary statistics
        total_scanned = sum(item.scanned_count for item in heatmap_items)
        total_mechanics = sum(item.unique_mechanics for item in heatmap_items)
        total_states = len(heatmap_items)
        
        return StateHeatmapResponse(
            data=heatmap_items,
            summary=StateHeatmapSummary(
                total_scanned=total_scanned,
                total_states=total_states,
                total_mechanics=total_mechanics,
                time_period=f"{start_date} to {end_date}"
            )
        )
