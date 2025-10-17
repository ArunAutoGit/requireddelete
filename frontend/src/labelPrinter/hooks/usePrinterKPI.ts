// hooks/usePrinterKPI.ts
import { useState, useEffect } from 'react';
import { printerService, PrinterKPIResponse } from '../services/printerService';
import { UsePrinterKPIResult } from '../../admin/types/useHooks';

// interface UsePrinterKPIResult {
//   data: PrinterKPIResponse | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// }

export const usePrinterKPI = (printerId?: number): UsePrinterKPIResult => {
  const [data, setData] = useState<PrinterKPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrinterKPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await printerService.getPrinterKPI(printerId);
      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch printer KPI:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinterKPI();
  }, [printerId]);

  const refetch = () => {
    fetchPrinterKPI();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};