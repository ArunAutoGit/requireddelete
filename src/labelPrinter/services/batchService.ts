import axios from "axios";
import { CouponBatchWithProductOut } from "../types/batch";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add request interceptor to include authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    // Handle 401 errors specifically
    if (error.response?.status === 401) {
      console.error("Authentication failed. Token may be expired or invalid.");
      // Optional: Clear token and redirect to login
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    throw error;
  }
);

export const batchService = {
  // Get all available batches with details
  getAvailableBatches: async (): Promise<CouponBatchWithProductOut[]> => {
    try {
      const response = await api.get<CouponBatchWithProductOut[]>("/coupon/batches/available/detailed");
      return response.data;
    } catch (error) {
      console.error("Error fetching available batches:", error);
      throw error;
    }
  },

  // Get single batch by ID for printing
  getBatchForPrinting: async (batchId: number): Promise<any> => {
    try {
      const response = await api.get(`/coupon/batches/${batchId}/print`);
      return response.data;
    } catch (error) {
      console.error("Error fetching batch for printing:", error);
      throw error;
    }
  },
};
