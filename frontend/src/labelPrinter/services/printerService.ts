// services/printerService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface PrinterKPIResponse {
  total_qr_generated: number;
  printed_batches: number;
  pending_printing: number;
}

export const printerService = {
  // Get Printer KPI data
  getPrinterKPI: async (printerId?: number): Promise<PrinterKPIResponse> => {
    try {
      let id = printerId;

      if (!id) {
        // ✅ Parse authUser and take its id
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          const parsedUser = JSON.parse(authUser);
          id = parsedUser?.id;
        }
      }

      if (!id) {
        throw new Error('Printer ID not found in localStorage (authUser.id missing)');
      }

      console.log(`Fetching printer KPI data for printer ID: ${id}...`);
      const response = await api.get<PrinterKPIResponse>(`/kpi/printer/${id}`);
      console.log('Printer KPI data fetched successfully:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('Error fetching printer KPI data:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },
};
