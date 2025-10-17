import React, { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "../../types/msrVisit";
import { LeafletMapProps } from "../../types/map";

// interface LeafletMapProps {
//   pins: MapPin[];
//   selectedPinId?: number;
//   onPinClick?: (pin: MapPin) => void;
// }

const FitBounds: React.FC<{ pins: MapPin[] }> = ({ pins }) => {
  const map = useMap();
  const bounds = useMemo(
    () => pins.map((p) => [p.lat, p.lng] as [number, number]),
    [pins]
  );

  useEffect(() => {
    if (!bounds.length) return;
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);

  return null;
};

const ResetView: React.FC<{ pins: MapPin[] }> = ({ pins }) => {
  const map = useMap();
  const handleReset = () => {
    if (!pins.length) return;
    const bounds = pins.map((p) => [p.lat, p.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <button
      onClick={handleReset}
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        background: "#fff",
        border: "1px solid #ccc",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        zIndex: 1000,
        fontSize: "12px",
      }}
    >
      🔄 Reset View
    </button>
  );
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  pins,
  selectedPinId,
  onPinClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const popupRefs = useRef<Record<number, L.Popup | null>>({});

  // Fly + open popup when selectedPinId changes
  useEffect(() => {
    if (!selectedPinId || !mapRef.current) return;

    const selectedPin = pins.find(
      (p) => p.visit.scan_batch_id === selectedPinId
    );
    if (selectedPin) {
      mapRef.current.flyTo([selectedPin.lat, selectedPin.lng], 15, {
        duration: 1.5,
      });

      const popup = popupRefs.current[selectedPinId];
      if (popup) popup.openOn(mapRef.current);
    }
  }, [selectedPinId, pins]);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
        />

        {pins.map((pin) => {
          const isSelected = pin.visit.scan_batch_id === selectedPinId;

          let fillColor = "#007bff"; // scheduled
          if (pin.type === "scanned") fillColor = "#FFA500";
          if (pin.mismatch) fillColor = "#FF4D4D";

          const strokeColor = isSelected ? "#000000" : "#ffffff";
          const zoom = mapRef.current?.getZoom() || 5;

          // Dynamic radius based on zoom
          const dynamicBaseRadius = Math.max(5, 15 - (zoom - 5));
          const radius = isSelected
            ? dynamicBaseRadius * 1.6
            : dynamicBaseRadius;

          return (
            <Circle
              key={pin.id}
              center={[pin.lat, pin.lng]}
              radius={radius}
              pathOptions={{
                fillColor,
                color: strokeColor,
                weight: isSelected ? 4 : pin.mismatch ? 3 : 2,
                fillOpacity: isSelected ? 0.9 : pin.mismatch ? 0.65 : 0.55,
              }}
              eventHandlers={{
                click: () => onPinClick?.(pin),
              }}
            >
              <Popup
                ref={(r) => {
                  if (r) popupRefs.current[pin.visit.scan_batch_id] = r;
                }}
              >
                <div
                  style={{
                    maxWidth: "250px",
                    fontSize: "12px",
                    lineHeight: 1.4,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: 6,
                      borderBottom: "1px solid #ddd",
                      paddingBottom: 4,
                    }}
                  >
                    {pin.visit.msr_name}
                  </h3>
                  <p>
                    <strong>Mechanic:</strong> {pin.visit.mechanic_name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(pin.visit.visit_datetime).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Coupons:</strong> {pin.visit.total_coupons}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹
                    {pin.visit.total_amount?.toLocaleString("en-IN") || "0"}
                  </p>
                  <p
                    style={{
                      marginTop: 6,
                      color: pin.mismatch ? "#FF0000" : "#00AA00",
                      fontWeight: "bold",
                    }}
                  >
                    {pin.mismatch
                      ? "⚠️ Location Mismatch"
                      : "✅ Location Match"}
                  </p>
                  <p style={{ color: "#666", fontSize: "11px", marginTop: 4 }}>
                    Type: {pin.type === "scheduled" ? "Scheduled" : "Scanned"}
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        <FitBounds pins={pins} />
        <ResetView pins={pins} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "16px",
          background: "white",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <h4
          style={{
            fontWeight: "bold",
            marginBottom: "6px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          Legend
        </h4>
        <div
          style={{
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
              }}
            ></div>
            <span>Scheduled Location</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FFA500",
                border: "2px solid #CC8400",
              }}
            ></div>
            <span>Scanned Location</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF4D4D",
                border: "2px solid #A00",
              }}
            ></div>
            <span>Location Mismatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
