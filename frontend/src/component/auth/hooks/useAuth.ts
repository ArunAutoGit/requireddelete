import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { UseAuthReturn } from '../../../admin/types/login';

// export interface UseAuthReturn {
//   isLoading: boolean;
//   error: string | null;
//   success: boolean;
  
  
//   requestOtp: (email: string) => Promise<void>;
//   validateOtp: (email: string, otp: string) => Promise<void>;
//   setNewPassword: (email: string, newPassword: string) => Promise<void>;
//   resetState: () => void;
//   clearError: () => void;
// }

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getErrorMessage = useCallback((err: any): string => {
    if (err.response?.status === 429) {
      return 'Too many attempts. Please wait before trying again.';
    }
    if (err.response?.status === 404) {
      return 'Email not found. Please check your email address.';
    }
    if (err.response?.status === 400) {
      return err.response?.data?.detail || 'Invalid request. Please try again.';
    }
    if (err.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }
    if (err.message?.includes('Network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (err.message) {
      return err.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [validateEmail, getErrorMessage]);

  const validateOtp = useCallback(async (email: string, otp: string) => {
    // Validate OTP format (assuming 6-digit OTP)
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be a 6-digit number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.validateOtp(email, otp);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage]);

  const setNewPassword = useCallback(async (email: string, newPassword: string) => {
    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(`Password requirements: ${passwordErrors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.setNewPassword(email, newPassword);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage]);

  return {
    isLoading,
    error,
    success,
    requestOtp,
    validateOtp,
    setNewPassword,
    resetState,
    clearError,
  };
};

// Password validation helper
const validatePassword = (password: string): string[] => {
  const errors = [];
  if (password.length < 8) errors.push('at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
  if (!/\d/.test(password)) errors.push('one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
  return errors;
};

export default useAuth;
