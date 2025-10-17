# app/core/rate_limiting.py
from slowapi import Limiter
from slowapi.util import get_remote_address
from collections import defaultdict
import time

# Simple in-memory rate limiter for geocoding
class GeocodeRateLimiter:
    def __init__(self, max_requests: int = 1, time_window: int = 1):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> bool:
        now = time.time()
        # Clean up old requests
        self.requests[identifier] = [t for t in self.requests[identifier] if now - t < self.time_window]
        
        if len(self.requests[identifier]) < self.max_requests:
            self.requests[identifier].append(now)
            return True
        return False

# Create a global rate limiter instance (1 request per second)
geocode_limiter = GeocodeRateLimiter(max_requests=1, time_window=1)

# Regular limiter for other endpoints
limiter = Limiter(key_func=get_remote_address)