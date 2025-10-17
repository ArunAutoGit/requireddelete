// hooks/useErrorHandler.ts
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorDetails } from '../types/useHooks';

// interface ErrorDetails {
//   message: string;
//   status?: number;
//   field?: string;
// }

export const useErrorHandler = () => {
  const [lastError, setLastError] = useState<ErrorDetails | null>(null);

  const handleApiError = (error: any, operation: string = 'operation'): ErrorDetails => {
    console.error(`Error in ${operation}:`, error);
    
    let errorDetails: ErrorDetails = {
      message: `Failed to ${operation}. Please try again.`
    };
    
    if (error?.response) {
      const { status, data } = error.response;
      errorDetails.status = status;
      
      if (status === 422 && data?.detail) {
        // Handle FastAPI validation errors
        if (Array.isArray(data.detail)) {
          // Multiple validation errors
          const fieldErrors = data.detail.map((err: any) => {
            const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : 'field';
            return `${field}: ${err.msg}`;
          });
          
          // Show first few errors to avoid overwhelming the user
          const displayErrors = fieldErrors.slice(0, 3).join('; ');
          errorDetails.message = `Validation errors: ${displayErrors}`;
          
          if (fieldErrors.length > 3) {
            errorDetails.message += ` (and ${fieldErrors.length - 3} more errors)`;
          }
        } else if (typeof data.detail === 'string') {
          errorDetails.message = data.detail;
        } else {
          errorDetails.message = 'Validation error occurred';
        }
      } else if (data?.message) {
        errorDetails.message = data.message;
      } else {
        // Status-based error messages
        switch (status) {
          case 400:
            errorDetails.message = 'Invalid request data';
            break;
          case 401:
            errorDetails.message = 'Unauthorized. Please login again';
            break;
          case 403:
            errorDetails.message = 'Access denied';
            break;
          case 409:
            errorDetails.message = 'User already exists';
            break;
          case 500:
            errorDetails.message = 'Server error. Please try again later';
            break;
          default:
            errorDetails.message = `Server error (${status}). Please try again`;
        }
      }
    } else if (error?.request) {
      // Network error
      errorDetails.message = 'Network error. Please check your connection';
    } else {
      // Other error
      errorDetails.message = error?.message || 'An unexpected error occurred';
    }
    
    setLastError(errorDetails);
    return errorDetails;
  };

  const showError = (error: any, operation: string = 'operation') => {
    const errorDetails = handleApiError(error, operation);
    toast.error(errorDetails.message);
    return errorDetails;
  };

  const clearError = () => {
    setLastError(null);
  };

  return {
    handleApiError,
    showError,
    lastError,
    clearError
  };
};
