import React from 'react';
import { Calendar, Clock, Settings } from 'lucide-react';
import { FilterState } from '../../types';
import { stateOptions } from '../../../data/mockData';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const timePresets = [
  { value: 'last24h', label: 'Last 24 Hours' },
  { value: 'last7d', label: 'Last 7 Days' },
  { value: 'last15d', label: 'Last 15 Days' },
  { value: 'last30d', label: 'Last 30 Days' },
  { value: 'last90d', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' }
];

const Filters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const handleTimeScopeChange = (timeScope: FilterState['timeScope']) => {
    onFiltersChange({
      ...filters,
      timeScope,
      customDateRange: timeScope === 'custom' ? filters.customDateRange : undefined
    });
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const currentRange = filters.customDateRange || { start: '', end: '' };
    onFiltersChange({
      ...filters,
      customDateRange: {
        start: field === 'start' ? value : currentRange.start,
        end: field === 'end' ? value : currentRange.end
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-blue-600" />
        Analysis Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Scope - Only filter kept */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-600" />
            Time Period
          </label>
          <select
            value={filters.timeScope}
            onChange={(e) => handleTimeScopeChange(e.target.value as FilterState['timeScope'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {timePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {filters.timeScope === 'custom' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-600" />
              Custom Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.customDateRange?.start || ''}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="date"
                value={filters.customDateRange?.end || ''}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;