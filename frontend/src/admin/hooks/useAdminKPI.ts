// hooks/useAdminKPI.ts
import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { AdminKPIResponse, UseAdminKPIResult } from '../types/useHooks';

// interface UseAdminKPIResult {
//   data: AdminKPIResponse | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// }

export const useAdminKPI = (): UseAdminKPIResult => {
  const [data, setData] = useState<AdminKPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminKPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.getAdminKPI();
      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch admin KPI:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminKPI();
  }, []);

  const refetch = () => {
    fetchAdminKPI();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};