import React, { useState, useMemo, useEffect } from 'react';
import { FilterState, HeatmapData, StateHeatmapResponse } from '../../types';
import { analyticsService } from '../../services/analyticsService';
import Filters from './Filters';
import Heatmap from './Heatmap';
import Legend from './Legend';
import StatsCards from './StatsCards';

interface DashboardProps {
  language: 'en' | 'hi';
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const [filters, setFilters] = useState<FilterState>({
    geographicalScope: 'nationwide',
    timeScope: 'last30d'
  });
  
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({
    areas: [],
    maxScanCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {};
      
      // Set date range
      if (filters.timeScope !== 'custom') {
        params.date_range = filters.timeScope;
      } else if (filters.customDateRange) {
        params.start_date = filters.customDateRange.start;
        params.end_date = filters.customDateRange.end;
      }
      
      // Set state filter if applicable
      if (filters.geographicalScope === 'state' && filters.selectedState) {
        params.state = filters.selectedState;
      }
      
      const response: StateHeatmapResponse = await analyticsService.getStateHeatmap(params);
      
      // Transform API response to HeatmapData format
      const areas = response.data.map(item => ({
        id: item.state,
        name: item.state,
        scanCount: item.scanned_count,
        uniqueMechanics: item.unique_mechanics,
        averageDailyScans: item.average_daily_scans,
        scanIntensity: item.scan_intensity
      }));
      
      const maxScanCount = Math.max(...areas.map(area => area.scanCount), 0);
      
      setHeatmapData({
        areas,
        maxScanCount,
        totalScanned: response.summary.total_scanned,
        totalStates: response.summary.total_states,
        totalMechanics: response.summary.total_mechanics
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch heatmap data');
      console.error('Error fetching heatmap data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, [filters]);

  const handleDrillDown = (areaId: string) => {
    console.log(`Drill-down to ${areaId}`);
    // For now, we'll keep it simple since API only supports state level
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchHeatmapData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Coupon Scanning Analytics' : 'कूपन स्कैनिंग एनालिटिक्स'}
          </h1>
          <p className="text-gray-600">
            {language === 'en'
              ? 'Monitor and analyze coupon redemption patterns across geographical regions'
              : 'भौगोलिक क्षेत्रों में कूपन रिडेम्पशन पैटर्न की निगरानी और विश्लेषण करें'}
          </p>
        </div>

        {/* Filters */}
        <Filters filters={filters} onFiltersChange={setFilters} />

        {/* Stats Cards */}
        <StatsCards data={heatmapData} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-3">
            <Heatmap
              data={heatmapData}
              filters={filters}
            />
          </div>

          {/* Legend */}
          <div className="lg:col-span-1">
            <Legend maxScanCount={heatmapData.maxScanCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;