# app/services/location_service.py
import requests
from typing import Optional
from sqlalchemy.orm import Session
from app.model.draftsession import DraftSession
from app.model.usermaster import UserMaster
from app.utils.geolocation import calculate_distance
from app.core.config import settings  # Import your settings

class LocationService:
    
    @staticmethod
    def verify_scan_location(db: Session, draft_session_id: int) -> bool:
        """Verify if scan location matches mechanic's registered location"""
        try:
            draft_session = db.query(DraftSession).filter(
                DraftSession.draft_session_id == draft_session_id
            ).first()
            
            if not draft_session or not draft_session.scan_latitude or not draft_session.scan_longitude:
                return False
            
            # Get mechanic's registered location
            mechanic = db.query(UserMaster).filter(
                UserMaster.user_id == draft_session.mechanic_id
            ).first()
            
            if not mechanic or not mechanic.latitude or not mechanic.longitude:
                return False
            
            # Calculate distance
            distance = calculate_distance(
                draft_session.scan_latitude, draft_session.scan_longitude,
                mechanic.latitude, mechanic.longitude
            )
            
            # Within 150 meters is considered verified (0.15 km)
            return distance <= 0.15
            
        except Exception as e:
            print(f"Location verification failed: {str(e)}")
            return False
    
    @staticmethod
    def reverse_geocode(latitude: float, longitude: float) -> Optional[str]:
        """Reverse geocode coordinates to get human-readable address"""
        try:
            # Option 1: Google Maps Geocoding API (Recommended - More accurate)
            if hasattr(settings, 'GOOGLE_MAPS_API_KEY') and settings.GOOGLE_MAPS_API_KEY:
                return LocationService._google_reverse_geocode(latitude, longitude)
            
            # Option 2: Nominatim (OpenStreetMap) - Fallback
            return LocationService._nominatim_reverse_geocode(latitude, longitude)
            
        except Exception as e:
            print(f"Reverse geocoding failed: {str(e)}")
            return None
    
    @staticmethod
    def _google_reverse_geocode(latitude: float, longitude: float) -> Optional[str]:
        """Use Google Maps Geocoding API"""
        try:
            url = f"https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                'latlng': f"{latitude},{longitude}",
                'key': settings.GOOGLE_MAPS_API_KEY
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'OK' and data['results']:
                    # Get the most specific formatted address
                    return data['results'][0]['formatted_address']
            return None
        except Exception as e:
            print(f"Google reverse geocoding failed: {str(e)}")
            return None
    
    @staticmethod
    def _nominatim_reverse_geocode(latitude: float, longitude: float) -> Optional[str]:
        """Use Nominatim (OpenStreetMap) as fallback"""
        try:
            url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&zoom=18"
            headers = {'User-Agent': 'CouponScanApp/1.0 (darshu3016@gmail.com)'}
            
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('display_name', 'Address not available')
            return None
        except Exception as e:
            print(f"Nominatim reverse geocoding failed: {str(e)}")
            return None
    
    @staticmethod
    def process_draft_location(db: Session, draft_session_id: int):
        """Complete location processing for a draft session"""
        try:
            draft_session = db.query(DraftSession).filter(
                DraftSession.draft_session_id == draft_session_id
            ).first()
            
            if not draft_session:
                return
            
            # Verify location (150 meter radius)
            is_verified = LocationService.verify_scan_location(db, draft_session_id)
            draft_session.location_verified = is_verified
            
            # If not verified, reverse geocode to get address
            if not is_verified and draft_session.scan_latitude and draft_session.scan_longitude:
                address = LocationService.reverse_geocode(
                    draft_session.scan_latitude, draft_session.scan_longitude
                )
                draft_session.scan_address = address
            
            db.commit()
            
        except Exception as e:
            print(f"Location processing failed for draft {draft_session_id}: {str(e)}")
            db.rollback()