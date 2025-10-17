import React, { useState, useEffect } from 'react';
import {  RefreshCw, AlertCircle, Layers } from 'lucide-react';
import { useBatches } from '../../hooks/useBatches';
import { BatchDashboardProps, BatchFilters as BatchFiltersType } from '../../types/batch';
import { batchService } from '../../services/batchService'; // Import the batch service
import BatchCard from './components/BatchCard';
import BatchFiltersComponent from './components/BatchFilters';
import BatchSkeleton from './components/BatchSkeleton';


// interface BatchDashboardProps {
//   isDark: boolean;
//   language: 'en' | 'hi';
//   onTabChange?: (tab: string, data?: any) => void; // Add this prop
// }

export default function BatchDashboard({ isDark, language, onTabChange }: BatchDashboardProps) {
  const [activeFilters, setActiveFilters] = useState<BatchFiltersType>({});
  const [loadingBatchId, setLoadingBatchId] = useState<number | null>(null);
  const { batches, loading, error, filterBatches, clearFilters, refreshBatches } = useBatches();

  const texts = {
    en: {
      title: 'Available Batches',
      subtitle: 'Manage and print generated label batches',
      searchPlaceholder: 'Search batches by ID, product, or part number...',
      availableBatches: 'Available Batches',
      batchManagement: 'Batch Management',
      status: 'Status',
      quantity: 'Quantity',
      totalValue: 'Total Value',
      created: 'Created',
      previewPrint: 'Preview & Print',
      refresh: 'Refresh',
      noBatches: 'No batches available',
      noBatchesDescription: 'All batches have been printed or no batches match your filters.',
      filters: 'Filters',
      clearFilters: 'Clear Filters',
      showing: 'Showing',
      of: 'of',
      batches: 'batches',
      loadingBatch: 'Loading batch data...'
    },
    hi: {
      title: 'उपलब्ध बैचेस',
      subtitle: 'जेनरेट किए गए लेबल बैचों को प्रबंधित और प्रिंट करें',
      searchPlaceholder: 'आईडी, उत्पाद, या पार्ट नंबर से बैच खोजें...',
      availableBatches: 'उपलब्ध बैचेस',
      batchManagement: 'बैच प्रबंधन',
      status: 'स्थिति',
      quantity: 'मात्रा',
      totalValue: 'कुल मूल्य',
      created: 'बनाया गया',
      previewPrint: 'पूर्वावलोकन और प्रिंट',
      refresh: 'ताज़ा करें',
      noBatches: 'कोई बैच उपलब्ध नहीं',
      noBatchesDescription: 'सभी बैच प्रिंट हो चुके हैं या कोई भी बैच आपके फ़िल्टर से मेल नहीं खाता।',
      filters: 'फ़िल्टर',
      clearFilters: 'फ़िल्टर साफ़ करें',
      showing: 'दिखा रहा है',
      of: 'में से',
      batches: 'बैच',
      loadingBatch: 'बैच डेटा लोड हो रहा है...'
    }
  };

  const currentTexts = texts[language];

  const handleFilterChange = (filters: BatchFiltersType) => {
    setActiveFilters(filters);
    filterBatches(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    clearFilters();
  };

  const handleRefresh = () => {
    // Clear filters when refreshing
    setActiveFilters({});
    clearFilters();
    refreshBatches();
  };

  // Handle print click - fetch batch data and navigate to print preview
  const handlePrintClick = async (batchId: number) => {
    if (!onTabChange) return;
    
    try {
      setLoadingBatchId(batchId);
      
      // Fetch the batch data for printing
      const batchData = await batchService.getBatchForPrinting(batchId);
      
      // Navigate to print preview with the batch data
      onTabChange('preview', batchData);
    } catch (error) {
      console.error('Error fetching batch data for printing:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoadingBatchId(null);
    }
  };

  // Apply current filters when component mounts or when batches change
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      filterBatches(activeFilters);
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-600">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {currentTexts.refresh}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentTexts.title}
          </h2>
          <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
            {currentTexts.subtitle}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#0066cc] text-white hover:bg-blue-700'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {currentTexts.refresh}
        </button>
      </div>

      {/* Filters */}
      <BatchFiltersComponent 
        onFilterChange={handleFilterChange} 
        onClear={handleClearFilters}
        isDark={isDark}
        language={language}
        activeFilters={activeFilters}
      />

      {/* Loading indicator for batch data */}
      {loadingBatchId && (
        <div className={`text-center py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {currentTexts.loadingBatch}
          </div>
        </div>
      )}

      {/* Loading State with Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <BatchSkeleton key={i} isDark={isDark} />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && batches.length > 0 && (
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {currentTexts.showing} <span className="font-medium">{batches.length}</span> {currentTexts.of}{' '}
          <span className="font-medium">{batches.length}</span> {currentTexts.batches}
        </div>
      )}

      {/* Batches Grid */}
      {!loading && batches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <BatchCard 
              key={batch.batch_id} 
              batch={batch} 
              isDark={isDark}
              language={language}
              onPrintClick={handlePrintClick}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && batches.length === 0 && (
        <div className={`text-center py-12 rounded-lg shadow-md ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Layers className={`w-16 h-16 mx-auto mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-300'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {currentTexts.noBatches}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {currentTexts.noBatchesDescription}
          </p>
        </div>
      )}
    </div>
  );
}