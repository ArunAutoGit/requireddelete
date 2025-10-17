import { MSRVisit, MSRVisitGrouped, MSRVisitsParams } from '../types/msrVisit';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class MSRVisitService {
  private async fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  async getMSRVisits(params: MSRVisitsParams): Promise<MSRVisit[]> {
    const { start_date, end_date, scanner_id, scanner_role } = params;
    
    const queryParams = new URLSearchParams({
      start_date: start_date,
      end_date: end_date,
      ...(scanner_id && { scanner_id: scanner_id.toString() }),
      ...(scanner_role && { scanner_role: scanner_role }),
    });

    const url = `${API_BASE_URL}/msr-visits?${queryParams}`;
    return this.fetchWithErrorHandling(url);
  }

  async getMSRVisitsGrouped(params: MSRVisitsParams): Promise<MSRVisitGrouped[]> {
    const { start_date, end_date, scanner_id, scanner_role } = params;
    
    const queryParams = new URLSearchParams({
      start_date: start_date,
      end_date: end_date,
      ...(scanner_id && { scanner_id: scanner_id.toString() }),
      ...(scanner_role && { scanner_role: scanner_role }),
    });

    const url = `${API_BASE_URL}/msr-visits-grouped?${queryParams}`;
    return this.fetchWithErrorHandling(url);
  }
}

export const msrVisitService = new MSRVisitService();