// Core heatmap data structures
export interface HeatmapArea {
  id: string;
  name: string;
  scanCount: number;
  type: 'state' | 'district';
  parent?: string;
  // Backend API properties
  uniqueMechanics?: number;
  scanIntensity?: number;
  averageDailyScans?: number;
}

export interface HeatmapData {
  areas: HeatmapArea[];
  maxScanCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  // Backend summary properties
  totalScanned?: number;
  totalStates?: number;
  totalMechanics?: number;
}

// Filter state for the dashboard - SINGLE DECLARATION WITH half-yearly
export interface FilterState {
  geographicalScope: 'nationwide' | 'state';
  timeScope: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' | 'custom';
  selectedState?: string;
  customDateRange?: {
    start: string; // YYYY-MM-DD format
    end: string;   // YYYY-MM-DD format
  };
}

// Tooltip data for heatmap interactions
export interface TooltipData {
  regionName: string;
  totalScans: number;
  dateRange: string;
  position: {
    x: number;
    y: number;
  };
  // Additional backend data for tooltips
  uniqueMechanics?: number;
  averageDailyScans?: number;
  scanIntensity?: number;
}

// API Response interfaces matching backend Pydantic schemas
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

export interface StateHeatmapResponse {
  success: boolean;
  data: StateHeatmapItem[];
  summary: StateHeatmapSummary;
}

// API request parameters
export interface HeatmapApiParams {
  date_range?: string;
  start_date?: string; // YYYY-MM-DD format
  end_date?: string;   // YYYY-MM-DD format
  state?: string;
  mechanic_id?: number;
  msr_id?: number;
}

// Hook state management
export interface HeatmapState {
  data: HeatmapData | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// Hook return type
export interface UseHeatmapDataReturn {
  data: HeatmapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

// Additional utility types for component props and configuration
export interface DashboardProps {
  language: 'en' | 'hi';
}

export interface StatsCardData {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export interface StateOption {
  value: string;
  label: string;
  code: string;
}

export interface TimePreset {
  value: FilterState['timeScope']; // Type-safe reference to timeScope values
  label: string;
}

// Utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
