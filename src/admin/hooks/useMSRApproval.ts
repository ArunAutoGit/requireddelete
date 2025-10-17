// hooks/useMSRApproval.ts
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UseMSRApprovalReturn } from '../types/useHooks';
import { MSRApiResponse } from '../types/msr';

// interface UseMSRApprovalReturn {
//   msrData: MSRApiResponse[];
//   loading: boolean;
//   error: string | null;
//   refreshData: () => Promise<void>;
//   updateMSRStatus: (userId: number, status: boolean, rejectionReason?: string) => Promise<void>;
// }

export const useMSRApproval = (): UseMSRApprovalReturn => {
  const [msrData, setMsrData] = useState<MSRApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMSRData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getMSRsByRole();
      setMsrData(data);
    } catch (error: any) {
      console.error('Error fetching MSR data:', error);
      setError(error?.response?.data?.message || 'Failed to fetch MSR data');
    } finally {
      setLoading(false);
    }
  };

  const updateMSRStatus = async (userId: number, status: boolean, rejectionReason?: string) => {
    try {
      if (status) {
        await userService.approveMSR(userId);
      } else {
        await userService.rejectMSR(userId, rejectionReason);
      }
      
      // Update local state
      setMsrData(prev => prev.map(msr => 
        msr.user_id === userId 
          ? { ...msr, status, updated_at: new Date().toISOString() }
          : msr
      ));
    } catch (error: any) {
      console.error('Error updating MSR status:', error);
      throw new Error(error?.response?.data?.message || 'Failed to update MSR status');
    }
  };

  useEffect(() => {
    fetchMSRData();
  }, []);

  return {
    msrData,
    loading,
    error,
    refreshData: fetchMSRData,
    updateMSRStatus
  };
};