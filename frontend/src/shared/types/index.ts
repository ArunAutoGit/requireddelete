export interface FilterState {
  geographicalScope: 'nationwide' | 'state';
  timeScope: 'last24h' | 'last7d' | 'last15d' | 'last30d' | 'last90d' | 'custom';
  selectedState?: string;
  customDateRange?: {
    start: string;
    end: string;
  };
}

export interface HeatmapData {
  areas: HeatmapArea[];
  maxScanCount: number;
  totalScanned?: number;
  totalStates?: number;
  totalMechanics?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface HeatmapArea {
  id: string;
  name: string;
  scanCount: number;
  uniqueMechanics?: number;
  averageDailyScans?: number;
  scanIntensity?: number;
}

export interface TooltipData {
  regionName: string;
  totalScans: number;
  dateRange: string;
  uniqueMechanics?: number;
  averageDailyScans?: number;
  scanIntensity?: number;
  position: {
    x: number;
    y: number;
  };
}

// API Response Types
export interface StateHeatmapResponse {
  success: boolean;
  data: StateHeatmapItem[];
  summary: StateHeatmapSummary;
}

export interface StateHeatmapItem {
  state: string;
  scanned_count: number;
  unique_mechanics: number;
  scan_intensity: number;
  average_daily_scans: number;
}

export interface StateHeatmapSummary {
  total_scanned: number;
  total_states: number;
  total_mechanics: number;
  time_period: string;
}