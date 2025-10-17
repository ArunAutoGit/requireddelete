// services/adminService.ts - Admin KPI service
import axios from 'axios';
import { AdminKPIResponse } from '../types/useHooks';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin KPI response type
// export interface AdminKPIResponse {
//   total_approved_msr: number;
//   pending_msr_approvals: number;
//   total_products: number;
// }

export const adminService = {
  // Get Admin KPI data
  getAdminKPI: async (): Promise<AdminKPIResponse> => {
    try {
      console.log('Fetching admin KPI data...');
      const response = await api.get<AdminKPIResponse>('/kpi/admin');
      console.log('Admin KPI data fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin KPI data:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },
};