// import { MapPin } from "../components/MsrVisit/MapPin";

import { MSRVisitGrouped } from "./msrVisit";

export interface MapPin {
  id: number;
  lat: number;
  lng: number;
  type: "scheduled" | "scanned";
  mismatch: boolean;
  visit: MSRVisitGrouped;
  color: string;
}

export interface GoogleMapProps {
  pins: MapPin[];
  onPinClick?: (pin: MapPin) => void;
  apiKey?: string; // Make it optional with fallback
}

export interface LeafletMapProps {
  pins: MapPin[];
  selectedPinId?: number;
  onPinClick?: (pin: MapPin) => void;
}