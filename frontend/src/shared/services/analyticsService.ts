import { 
  StateHeatmapRequest, 
  StateHeatmapResponse, 
  DateRangeOption, 
  StateHeatmapItem
} from '../types/analytics';
import { apiClient } from './apiClient';

class AnalyticsService {
  private baseUrl = '/analytics';

  async getStateHeatmap(params: StateHeatmapRequest): Promise<StateHeatmapResponse> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params.date_range) queryParams.append('date_range', params.date_range);
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.state) queryParams.append('state', params.state);
      if (params.mechanic_id) queryParams.append('mechanic_id', params.mechanic_id.toString());
      if (params.msr_id) queryParams.append('msr_id', params.msr_id.toString());

      const response = await apiClient.get<StateHeatmapResponse>(
        `${this.baseUrl}/heatmap/state-wise?${queryParams}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid request parameters');
      } else if (error.response?.status === 500) {
        throw new Error('Server error while fetching heatmap data');
      }
      throw error;
    }
  }

  // Helper method to calculate date range from predefined options
  calculateDateRange(range: DateRangeOption): { startDate: string; endDate: string } {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    
    let startDate = new Date();
    
    switch (range) {
      case 'last24h':
        startDate.setDate(today.getDate() - 1);
        break;
      case 'last7d':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last15d':
        startDate.setDate(today.getDate() - 15);
        break;
      case 'last30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last90d':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate.setDate(today.getDate() - 30); // Default to last 30 days
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate
    };
  }

  // Format data for charts
  formatHeatmapDataForChart(data: StateHeatmapItem[]) {
    return data.map(item => ({
      state: item.state,
      value: item.scanned_count,
      intensity: item.scan_intensity,
      mechanics: item.unique_mechanics,
      dailyAverage: item.average_daily_scans
    }));
  }
}

export const analyticsService = new AnalyticsService();