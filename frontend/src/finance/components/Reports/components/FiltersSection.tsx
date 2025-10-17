import React from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { labels } from '../constants/labels';
import { FiltersSectionProps } from '../../../../admin/types/filter';

// interface FiltersSectionProps {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   dateRange: string;
//   setDateRange: (range: string) => void;
//   onExport: (format: string) => void;
//   language: 'en' | 'hi';
// }

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  onExport,
  language
}) => {
  const text = labels[language];

  const dateRangeOptions = [
    { value: "daily", label: text.dateRangeOptions.daily },
    { value: "weekly", label: text.dateRangeOptions.weekly },
    { value: "monthly", label: text.dateRangeOptions.monthly },
    { value: "quarterly", label: text.dateRangeOptions.quarterly },
    { value: "half-yearly", label: text.dateRangeOptions.halfYearly },
    { value: "annually", label: text.dateRangeOptions.annually },
    { value: "custom", label: text.dateRangeOptions.custom },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
      <div className="pb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {text.filtersAndExport}
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Selector */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              {text.dateRange}
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search Input */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              {text.msrSearch}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={text.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Export Buttons */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              {text.exportData}
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => onExport('csv')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                {text.csv}
              </button>
              <button 
                onClick={() => onExport('pdf')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                {text.pdf}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
