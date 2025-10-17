export interface MSRVisit {
  visit_id: number;
  visit_datetime: string;
  coupon_amount: number;
  msr_id: number;
  msr_name: string;
  msr_role: string;
  mechanic_id: number;
  mechanic_name: string;
  scheduled_lat?: number;
  scheduled_lng?: number;
  scanned_lat?: number;
  scanned_lng?: number;
  scanned_address?: string;
  location_mismatch: boolean;
}

export interface MSRVisitGrouped {
  scan_batch_id: number;
  visit_datetime: string;
  msr_id: number;
  msr_name: string;
  msr_role: string;
  mechanic_id: number;
  mechanic_name: string;
  scheduled_lat?: number;
  scheduled_lng?: number;
  scanned_lat?: number;
  scanned_lng?: number;
  scanned_address?: string;
  location_mismatch: boolean;
  total_coupons: number;
  total_amount: number;
}

export interface MSRVisitsParams {
  start_date: string;
  end_date: string;
  scanner_id?: number;
  scanner_role?: string;
}

export interface MapPin {
  marker: any;
  id: number;
  lat: number;
  lng: number;
  type: 'scheduled' | 'scanned';
  mismatch: boolean;
  visit: MSRVisitGrouped;
  color: string;
}

export interface MSRVisitsTableProps {
  visits: MSRVisitGrouped[];
  selectedPinId?: number;
  onRowClick?: (visit: MSRVisitGrouped) => void;
  dateRangeColors: string[];
  rowRefs?: React.MutableRefObject<Record<number, HTMLTableRowElement | null>>;
}