import axios from 'axios';
import { ForgotPasswordResponse, SetNewPasswordResponse, ValidateOtpResponse } from '../../../admin/types/login';

const API_BASE_URL = 'http://localhost:8000';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    throw error;
  }
);

// export interface ForgotPasswordResponse {
//   message: string;
// }

// export interface ValidateOtpResponse {
//   message: string;
// }

// export interface SetNewPasswordResponse {
//   message: string;
// }

export const authService = {
  // Request OTP for password reset
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    
    const response = await authApi.post<ForgotPasswordResponse>('/forgot-password/', formData);
    return response.data;
  },

  // Validate OTP
  validateOtp: async (email: string, otp: string): Promise<ValidateOtpResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('otp', otp);
    
    const response = await authApi.post<ValidateOtpResponse>('/validate-otp/', formData);
    return response.data;
  },

  // Set new password after OTP validation
  setNewPassword: async (email: string, newPassword: string): Promise<SetNewPasswordResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('new_password', newPassword);
    
    const response = await authApi.post<SetNewPasswordResponse>('/set-new-password/', formData);
    return response.data;
  },
};

export default authService;
