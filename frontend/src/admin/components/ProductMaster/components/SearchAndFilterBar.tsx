// components/products/SearchAndFilterBar.tsx
import React from 'react';
import { Search, Download } from 'lucide-react';
import { SearchAndFilterBarProps } from '../../../types/products';

// interface SearchAndFilterBarProps {
//   searchTerm: string;
//   onSearchChange: (term: string) => void;
//   itemsPerPage: number;
//   onItemsPerPageChange: (count: number) => void;
//   onExport: () => void;
//   isExporting: boolean;
//   language: 'en' | 'hi';
// }

const translations = {
  en: {
    searchPlaceholder: "Search products...",
    itemsPerPage: "Items per page:",
    export: "Export to Excel",
    exporting: "Exporting..."
  },
  hi: {
    searchPlaceholder: "उत्पादों की खोज करें...",
    itemsPerPage: "प्रति पृष्ठ आइटम:",
    export: "एक्सेल में निर्यात करें",
    exporting: "निर्यात हो रहा..."
  }
};

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onExport,
  isExporting,
  language
}: SearchAndFilterBarProps) {
  const t = translations[language];

  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">{t.itemsPerPage}</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button 
            onClick={onExport}
            disabled={isExporting}
            className="bg-[#ffff4d] hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? t.exporting : t.export}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
