import math

def haversine(lat1, lon1, lat2, lon2):
    # Earth radius in meters
    R = 6371000  

    # Convert degrees to radians
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    # Haversine formula
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # Distance in meters


# Example locations
lat1, lon1 = 10.87122570, 79.81105100
lat2, lon2 = 10.8712257, 79.811051

distance = haversine(lat1, lon1, lat2, lon2)
print(f"Distance: {distance:.6f} meters")

if distance > 150:
    print("Location mismatch ❌")
else:
    print("Locations match ✅")

