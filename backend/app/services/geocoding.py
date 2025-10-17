# app/services/geocoding.py
import httpx
import logging
import asyncio
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, Request
from app.core.rate_limiting import geocode_limiter

logger = logging.getLogger(__name__)

class EnhancedOpenStreetMapGeocoder:
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org/reverse"
        self.headers = {
            "User-Agent": "YourApp/1.0 (contact@yourapp.com)",
            "Accept-Language": "en"
        }
    
    async def reverse_geocode(self, lat: float, lon: float, request: Request) -> Optional[Dict[str, Any]]:
        """
        Enhanced reverse geocoding with multiple accuracy improvements
        """
        # Apply rate limiting
        client_ip = request.client.host if request.client else "global"
        if not geocode_limiter.is_allowed(client_ip):
            raise HTTPException(
                status_code=429, 
                detail="Geocoding rate limit exceeded. Please try again in a moment."
            )
        
        try:
            # Try multiple zoom levels for better accuracy
            results = await self._try_multiple_zoom_levels(lat, lon)
            
            if results:
                # Return the most detailed result
                return self._select_best_result(results)
            
            logger.warning(f"No address found for coordinates: {lat}, {lon}")
            return None
                
        except httpx.TimeoutException:
            logger.error("Geocoding request timed out")
            raise HTTPException(status_code=504, detail="Geocoding service timeout")
        except Exception as e:
            logger.error(f"Reverse geocoding failed: {e}")
            raise HTTPException(status_code=500, detail="Geocoding service error")

    async def _try_multiple_zoom_levels(self, lat: float, lon: float) -> List[Dict[str, Any]]:
        """Try different zoom levels to get the best accuracy"""
        zoom_levels = [18, 16, 14]
        results = []
        
        async with httpx.AsyncClient() as client:
            for zoom in zoom_levels:
                try:
                    params = {
                        "format": "json",
                        "lat": lat,
                        "lon": lon,
                        "addressdetails": 1,
                        "zoom": zoom,
                        "extratags": 1,
                        "namedetails": 1
                    }
                    
                    response = await client.get(
                        self.base_url, 
                        params=params, 
                        headers=self.headers,
                        timeout=8.0
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        if data and not data.get('error'):
                            results.append(data)
                            # If we got a good result with high zoom, return early
                            if zoom == 18 and self._is_detailed_address(data):
                                break
                    
                    # Small delay between requests
                    await asyncio.sleep(0.1)
                    
                except Exception as e:
                    logger.debug(f"Zoom level {zoom} failed: {e}")
                    continue
        
        return results

    def _select_best_result(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select the most detailed and accurate result"""
        if not results:
            return None
            
        # Prefer results with more address details
        for result in results:
            if self._is_detailed_address(result):
                return result
        
        return results[0]

    def _is_detailed_address(self, data: Dict[str, Any]) -> bool:
        """Check if the address contains detailed information"""
        if not data or 'address' not in data:
            return False
        
        address = data.get('address', {})
        has_house_number = bool(address.get('house_number'))
        has_road = bool(address.get('road'))
        has_suburb = bool(address.get('suburb') or address.get('village') or address.get('town'))
        
        return has_house_number and has_road and has_suburb

# Standalone functions (not part of the class)
def parse_enhanced_osm_address(data: Dict) -> Dict[str, str]:
    """
    Enhanced address parsing with better fallbacks and accuracy
    """
    if not data or 'address' not in data:
        return {}
    
    address = data.get("address", {})
    
    # Build address line 1 with better logic
    house_number = address.get('house_number', '')
    road = address.get('road', '')
    address_line1 = f"{house_number} {road}".strip()
    
    # If no house number, try building or place name
    if not address_line1:
        address_line1 = address.get('building') or address.get('place') or ''
    
    # Build address line 2 with better hierarchy
    address_line2 = _get_address_line_2(address)
    
    # Improved state and district extraction
    state = address.get('state')
    district = _get_best_district(address)
    
    # Clean up district name
    if district:
        district = _clean_district_name(district)
    
    return {
        "address_line1": address_line1 or None,
        "address_line2": address_line2 or None,
        "state": state or None,
        "district": district or None,
        "pincode": address.get('postcode') or None,
        "raw_address": data.get('display_name')
    }

def _get_address_line_2(address: Dict) -> str:
    """Get the best address line 2 content"""
    hierarchy = [
        address.get('suburb'),
        address.get('village'),
        address.get('town'),
        address.get('city_district'),
        address.get('neighborhood')
    ]
    
    for item in hierarchy:
        if item:
            return item
    return ''

def _get_best_district(address: Dict) -> str:
    """Get the most appropriate district name"""
    district_options = [
        address.get('county'),
        address.get('city_district'),
        address.get('state_district'),
        address.get('municipality')
    ]
    
    for district in district_options:
        if district:
            return district
    return None

def _clean_district_name(district: str) -> str:
    """Clean up district names"""
    removals = ['district', 'county', 'municipality', 'borough']
    cleaned = district
    for removal in removals:
        cleaned = cleaned.replace(removal, '').replace(removal.title(), '').strip()
    return cleaned

# Create enhanced singleton instance
enhanced_osm_geocoder = EnhancedOpenStreetMapGeocoder()