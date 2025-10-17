import { useState, useEffect } from 'react';
import { batchService } from '../services/batchService';
import { CouponBatchWithProductOut, BatchFilters } from '../types/batch';

export const useBatches = () => {
  const [batches, setBatches] = useState<CouponBatchWithProductOut[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<CouponBatchWithProductOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await batchService.getAvailableBatches();
      setBatches(data);
      setFilteredBatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  // Filter batches based on criteria
  const filterBatches = (filters: BatchFilters) => {
    let filtered = batches;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(batch => 
        batch.batch_id.toString().includes(searchLower) ||
        batch.product_details?.product_name?.toLowerCase().includes(searchLower) ||
        batch.product_details?.part_no?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(batch => batch.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(batch => 
        new Date(batch.created_at) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate!);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter(batch => 
        new Date(batch.created_at) <= endDate
      );
    }

    if (filters.productName) {
      filtered = filtered.filter(batch => 
        batch.product_details?.product_name?.toLowerCase().includes(filters.productName!.toLowerCase())
      );
    }

    setFilteredBatches(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilteredBatches(batches);
  };

  // Refresh batches
  const refreshBatches = () => {
    fetchBatches();
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return {
    batches: filteredBatches,
    loading,
    error,
    filterBatches,
    clearFilters,
    refreshBatches,
    totalCount: batches.length,
    filteredCount: filteredBatches.length
  };
};