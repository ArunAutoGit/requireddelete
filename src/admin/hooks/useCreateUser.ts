// useCreateUser.ts
import { useState } from 'react';
import { userService, UserPayload } from '../services/userService';
import { toast } from 'react-hot-toast';
import { CreateUserResponse } from '../types/useHooks';

// Define the response type from the API
// interface CreateUserResponse {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   message?: string;
  
// }

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: Omit<UserPayload, 'reports_to'>): Promise<CreateUserResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.createUser(userData);
      toast.success('User created successfully!');
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
};