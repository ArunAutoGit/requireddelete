// services/userService.ts
import axios from 'axios';
import { ApiUserResponse, FastAPIValidationError, UserPayload } from '../types/user';
import { MSRApiResponse } from '../types/msr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userService = {
  // Get all users with pagination
  getUsers: async (skip: number = 0, limit: number = 100): Promise<ApiUserResponse[]> => {
    try {
      const response = await api.get<ApiUserResponse[]>(`/users/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: UserPayload): Promise<ApiUserResponse> => {
    try {
      console.log('Creating user with payload:', JSON.stringify(userData, null, 2));
      const response = await api.post<ApiUserResponse>('/users/', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Enhanced error logging for 422 responses
      if (error?.response?.status === 422) {
        console.error('422 Validation Error Details:');
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
        console.error('Headers:', error.response.headers);
        
        // Log individual validation errors if available
        const errorData = error.response.data as FastAPIValidationError;
        if (Array.isArray(errorData.detail)) {
          console.error('Validation Errors:');
          errorData.detail.forEach((err, index) => {
            console.error(`  ${index + 1}. Field: ${err.loc.join('.')}, Message: ${err.msg}, Type: ${err.type}`);
            if (err.input) console.error(`     Input: ${JSON.stringify(err.input)}`);
          });
        }
      }
      
      if (error?.response?.data) {
        console.error('Error response data:', error.response.data);
      }
      
      throw error;
    }
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<UserPayload>): Promise<ApiUserResponse> => {
    try {
      console.log(`Updating user ${userId} with payload:`, JSON.stringify(userData, null, 2));
      const response = await api.put<ApiUserResponse>(`/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating user ${userId}:`, error);
      
      // Enhanced error logging for updates too
      if (error?.response?.status === 422) {
        console.error('422 Update Validation Error Details:');
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Get MSRs by role
  getMSRsByRole: async (): Promise<MSRApiResponse[]> => {
    try {
      console.log('Fetching MSR users...');
      const response = await api.get<MSRApiResponse[]>('/users/role/msr');
      console.log('MSR users fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching MSR users:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Approve MSR
  approveMSR: async (userId: number): Promise<ApiUserResponse> => {
    try {
      console.log(`Approving MSR for user ${userId}`);
      const response = await api.post<ApiUserResponse>(`/users/${userId}/approve`);
      console.log('MSR approved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error approving MSR for user ${userId}:`, error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Reject MSR (if you have a reject endpoint)
  rejectMSR: async (userId: number, rejectionReason?: string): Promise<ApiUserResponse> => {
    try {
      const payload = rejectionReason ? { rejection_reason: rejectionReason } : {};
      console.log(`Rejecting MSR for user ${userId}:`, payload);
      // const response = await api.post<ApiUserResponse>(`/users/${userId}/reject`, payload);
      const response =await api.post<ApiUserResponse>(
        `/users/${userId}/reject?reason=${encodeURIComponent(
          rejectionReason || ""
        )}`
      );

      console.log('MSR rejected successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error rejecting MSR for user ${userId}:`, error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },
};
