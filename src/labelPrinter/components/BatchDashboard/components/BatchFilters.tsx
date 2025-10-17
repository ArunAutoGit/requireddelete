import React, { useState, useEffect } from 'react';
import { BatchFiltersProps, BatchFilters as BatchFiltersType } from '../../../types/batch';
import { Search, X } from 'lucide-react';

// interface BatchFiltersProps {
//   onFilterChange: (filters: BatchFiltersType) => void;
//   onClear: () => void;
//   isDark: boolean;
//   language: 'en' | 'hi';
//   activeFilters?: BatchFiltersType;
// }

const BatchFilters: React.FC<BatchFiltersProps> = ({ 
  onFilterChange, 
  onClear, 
  isDark, 
  language,
  activeFilters = {}
}) => {
  const [filters, setFilters] = useState<BatchFiltersType>(activeFilters);

  const texts = {
    en: {
      searchPlaceholder: 'Search by Batch ID...',
      productName: 'Product Name',
      productNamePlaceholder: 'Search by product or part name...',
      fromDate: 'From Date',
      toDate: 'To Date',
      clearFilters: 'Clear All Filters'
    },
    hi: {
      searchPlaceholder: 'बैच आईडी से खोजें...',
      productName: 'उत्पाद नाम',
      productNamePlaceholder: 'उत्पाद या पार्ट नाम से खोजें...',
      fromDate: 'तारीख से',
      toDate: 'तारीख तक',
      clearFilters: 'सभी फ़िल्टर साफ़ करें'
    }
  };

  const currentTexts = texts[language];

  // Sync local state with parent activeFilters
  useEffect(() => {
    setFilters(activeFilters);
  }, [activeFilters]);

  const handleFilterChange = (key: keyof BatchFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value && value.length > 0);

  return (
    <div className={`rounded-xl border shadow-sm p-4 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="space-y-4">
        {/* Search Bar - Batch ID */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder={currentTexts.searchPlaceholder}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc]`}
          />
        </div>

        {/* Advanced Filters - Always Visible */}
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Product Name Filter */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {currentTexts.productName}
              </label>
              <input
                type="text"
                value={filters.productName || ''}
                onChange={(e) => handleFilterChange('productName', e.target.value)}
                placeholder={currentTexts.productNamePlaceholder}
                className={`w-full border rounded-lg px-3 py-2 ${
                  isDark 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc]`}
              />
            </div>

            {/* Date Range */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {currentTexts.fromDate}
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  isDark 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc]`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {currentTexts.toDate}
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  isDark 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc]`}
              />
            </div>
          </div>

          {/* Clear Filters Button - Always visible when filters are active */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                <X className="w-4 h-4" />
                {currentTexts.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchFilters;
