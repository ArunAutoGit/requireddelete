// types/analytics.ts

// Request types
export interface StateHeatmapRequest {
  date_range?: string;
  start_date?: string;
  end_date?: string;
  state?: string;
  mechanic_id?: number;
  msr_id?: number;
}

export type DateRangeOption = 'last24h' | 'last7d' | 'last15d' | 'last30d' | 'last90d' | 'custom';

// Response types
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

// UI types (for your components)
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

// Helper function to convert API response to UI format
export const convertToHeatmapData = (response: StateHeatmapResponse): HeatmapData => {
  const areas: HeatmapArea[] = response.data.map(item => ({
    id: item.state,
    name: item.state,
    scanCount: item.scanned_count,
    uniqueMechanics: item.unique_mechanics,
    averageDailyScans: item.average_daily_scans,
    scanIntensity: item.scan_intensity
  }));

  const maxScanCount = Math.max(...response.data.map(item => item.scanned_count), 0);

  return {
    areas,
    maxScanCount,
    totalScanned: response.summary.total_scanned,
    totalStates: response.summary.total_states,
    totalMechanics: response.summary.total_mechanics,
    dateRange: response.summary.time_period ? {
      start: response.summary.time_period.split(' to ')[0],
      end: response.summary.time_period.split(' to ')[1]
    } : undefined
  };
};