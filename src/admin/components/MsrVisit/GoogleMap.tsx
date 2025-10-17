import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from '../../types/msrVisit';
import { GoogleMapProps } from '../../types/map';

// interface GoogleMapProps {
//   pins: MapPin[];
//   onPinClick?: (pin: MapPin) => void;
//   apiKey?: string; // Make it optional with fallback
// }

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  pins, 
  onPinClick,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !apiKey || apiKey === '') {
        setError('Google Maps API key is not configured');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 13.0827, lng: 80.2707 }, // Default to Chennai
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeControl: true,
        };

        const googleMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(googleMap);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
      }
    };

    initMap();
  }, [apiKey]);

  // Update markers when pins change
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (pins.length === 0) return;

    // Add new markers
    const bounds = new google.maps.LatLngBounds();
    
    pins.forEach((pin) => {
      const position = { lat: pin.lat, lng: pin.lng };
      
      // Create marker with custom styling based on type and mismatch
      const marker = new google.maps.Marker({
        position,
        map,
        title: `${pin.visit.msr_name} - ${pin.visit.mechanic_name}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: pin.color,
          fillOpacity: pin.mismatch ? 0.8 : 0.6,
          strokeColor: pin.mismatch ? '#FF0000' : '#FFFFFF',
          strokeWeight: pin.mismatch ? 3 : 2,
          scale: pin.type === 'scheduled' ? 8 : 6,
        }
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">
              ${pin.visit.msr_name}
            </h3>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Mechanic:</strong> ${pin.visit.mechanic_name}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Date:</strong> ${new Date(pin.visit.visit_datetime).toLocaleDateString()}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Coupons:</strong> ${pin.visit.total_coupons}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Amount:</strong> ₹${pin.visit.total_amount?.toLocaleString('en-IN') || '0'}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: ${pin.mismatch ? '#FF0000' : '#00AA00'}; font-weight: bold;">
              ${pin.mismatch ? '⚠️ Location Mismatch' : '✅ Location Match'}
            </p>
            <p style="margin: 4px 0; font-size: 11px; color: #888;">
              Type: ${pin.type === 'scheduled' ? 'Scheduled Location' : 'Scanned Location'}
            </p>
          </div>
        `
      });

      // Add click listener
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onPinClick?.(pin);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Fit map to show all markers
    if (pins.length > 0) {
      map.fitBounds(bounds);
      
      // Set minimum zoom level
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
      });
    }
  }, [map, pins, onPinClick, isLoaded]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            Please configure your Google Maps API key in environment variables
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative rounded-lg overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Scheduled Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 border-2 border-red-700"></div>
            <span>Scanned Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-700"></div>
            <span>Location Mismatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;