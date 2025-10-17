import { useState, useCallback } from 'react';
import { StateHeatmapRequest, StateHeatmapResponse, StateHeatmapItem, DateRangeOption } from '../types/analytics';
import { analyticsService } from '../services/analyticsService';

interface UseStateHeatmapReturn {
  data: StateHeatmapItem[];
  summary: StateHeatmapResponse['summary'] | null;
  loading: boolean;
  error: string | null;
  fetchStateHeatmap: (params: StateHeatmapRequest) => Promise<void>;
  refresh: () => void;
}

interface UseStateHeatmapProps {
  initialParams?: Partial<StateHeatmapRequest>;
  autoFetch?: boolean;
}

export const useStateHeatmap = ({ initialParams, autoFetch = true }: UseStateHeatmapProps = {}): UseStateHeatmapReturn => {
  const [data, setData] = useState<StateHeatmapItem[]>([]);
  const [summary, setSummary] = useState<StateHeatmapResponse['summary'] | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<Partial<StateHeatmapRequest>>(initialParams || {});

  const fetchStateHeatmap = useCallback(async (params: StateHeatmapRequest) => {
    setLoading(true);
    setError(null);
    setCurrentParams(params);

    try {
      const response = await analyticsService.getStateHeatmap(params);
      setData(response.data);
      setSummary(response.summary);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch heatmap data');
      console.error('Error fetching state heatmap:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    if (Object.keys(currentParams).length > 0) {
      fetchStateHeatmap(currentParams as StateHeatmapRequest);
    }
  }, [currentParams, fetchStateHeatmap]);

  // Auto-fetch on mount if autoFetch is true and initialParams are provided
  useState(() => {
    if (autoFetch && initialParams) {
      fetchStateHeatmap(initialParams as StateHeatmapRequest);
    }
  });

  return {
    data,
    summary,
    loading,
    error,
    fetchStateHeatmap,
    refresh
  };
};

// Additional hook for common date range handling
export const useDateRange = (initialRange: DateRangeOption = 'last30d') => {
  const [dateRange, setDateRange] = useState<DateRangeOption>(initialRange);
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);

  const getRequestParams = (): Partial<StateHeatmapRequest> => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      return {
        start_date: customStartDate,
        end_date: customEndDate
      };
    } else if (dateRange !== 'custom') {
      return {
        date_range: dateRange
      };
    }
    return {};
  };

  return {
    dateRange,
    setDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    getRequestParams
  };
};