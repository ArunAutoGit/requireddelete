import { useState, useEffect, useCallback } from 'react';
import { MSRVisit, MSRVisitGrouped, MSRVisitsParams } from '../types/msrVisit';
import { msrVisitService } from '../services/msrVisitService';

export const useMSRVisits = (params: MSRVisitsParams) => {
  const [data, setData] = useState<MSRVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const visits = await msrVisitService.getMSRVisits(params);
      setData(visits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch MSR visits');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useMSRVisitsGrouped = (params: MSRVisitsParams) => {
  const [data, setData] = useState<MSRVisitGrouped[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use individual values as dependencies instead of the object
  const { start_date, end_date, scanner_id, scanner_role } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const visits = await msrVisitService.getMSRVisitsGrouped({
          start_date,
          end_date,
          scanner_id,
          scanner_role
        });
        setData(visits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch grouped MSR visits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [start_date, end_date, scanner_id, scanner_role]); // Individual dependencies

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const visits = await msrVisitService.getMSRVisitsGrouped({
        start_date,
        end_date,
        scanner_id,
        scanner_role
      });
      setData(visits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grouped MSR visits');
    } finally {
      setIsLoading(false);
    }
  }, [start_date, end_date, scanner_id, scanner_role]);

  return { data, isLoading, error, refetch };
};
