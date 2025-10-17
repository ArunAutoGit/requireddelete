// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useErrorHandler } from './useErrorHandler';
import { ApiUser, User } from '../types/user';

// API response type based on your provided data structure
// export interface ApiUser {
//   t_no: string | null;
//   name: string;
//   designation: string | null;
//   hq: string | null;
//   responsibility: string | null;
//   role: string;
//   reports_to: number | null;
//   email: string | null;
//   mobile: string | null;
//   address_line1: string | null;
//   address_line2: string | null;
//   state: string | null;
//   district: string | null;
//   pincode: string | null;
//   location: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   company_name: string | null;
//   bank_account_holder: string | null;
//   bank_name: string | null;
//   bank_account_number: string | null;
//   bank_ifsc_code: string | null;
//   user_id: number;
//   status: boolean;
//   created_at: string;
//   updated_at: string;
// }

// Frontend User type (for UI display) - Updated with separated plant location
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   mobile: string;
//   status: string;
//   createdAt: string;
  
//   // Address fields
//   addressLine1?: string;
//   addressLine2?: string;
//   state?: string;
//   district?: string;
//   pincode?: string;
//   location?: string; // This will be address-based location for non-printer users
//   latitude?: number;
//   longitude?: number;
  
//   // Plant location specifically for printer users
//   plantLocation?: string;
  
//   // Company/Bank fields
//   companyName?: string;
//   bankAccount?: string;
//   bankName?: string;
//   accountHolderName?: string;
//   ifsc?: string;
  
//   // Additional fields from API
//   tNo?: string;
//   designation?: string;
//   hq?: string;
//   responsibility?: string;
//   reportsTo?: number;
// }

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useErrorHandler();

  // Convert API user data to frontend format - Updated mapping with separated locations
  const mapApiUserToUser = (apiUser: ApiUser): User => {
    const isPrinterUser = apiUser.role.toLowerCase() === 'printer';
    
    // Build address-based location from address fields
    const addressParts = [
      apiUser.address_line1,
      apiUser.address_line2,
      apiUser.district,
      apiUser.state,
      apiUser.pincode
    ].filter(Boolean);
    const addressLocation = addressParts.length > 0 ? addressParts.join(', ') : undefined;
    
    // Extract plant location for printer users from the location field
    let plantLocation = undefined;
    if (isPrinterUser && apiUser.location) {
      // Handle both formats: "Plant 01" or just "01"
      if (apiUser.location.startsWith('Plant ')) {
        // If API returns "Plant 01", extract just "01"
        plantLocation = apiUser.location.replace('Plant ', '');
      } else if (/^[0-9]{2}$/.test(apiUser.location.trim())) {
        // If API returns just "01", "02", etc., use it directly
        plantLocation = apiUser.location.trim();
      }
    }

    return {
      id: apiUser.user_id.toString(),
      name: apiUser.name,
      email: apiUser.email || '',
      role: apiUser.role,
      mobile: apiUser.mobile || '',
      status: apiUser.status ? 'Active' : 'Inactive',
      createdAt: new Date(apiUser.created_at).toISOString().split('T')[0],
      
      // Address fields
      addressLine1: apiUser.address_line1 || undefined,
      addressLine2: apiUser.address_line2 || undefined,
      state: apiUser.state || undefined,
      district: apiUser.district || undefined,
      pincode: apiUser.pincode || undefined,
      location: addressLocation, // Address-based location for display
      plantLocation: plantLocation, // Plant number only (01, 02, etc.)
      latitude: apiUser.latitude || undefined,
      longitude: apiUser.longitude || undefined,
      
      // Company/Bank fields
      companyName: apiUser.company_name || undefined,
      bankAccount: apiUser.bank_account_number || undefined,
      bankName: apiUser.bank_name || undefined,
      accountHolderName: apiUser.bank_account_holder || undefined,
      ifsc: apiUser.bank_ifsc_code || undefined,
      
      // Additional fields
      tNo: apiUser.t_no || undefined,
      designation: apiUser.designation || undefined,
      hq: apiUser.hq || undefined,
      responsibility: apiUser.responsibility || undefined,
      reportsTo: apiUser.reports_to || undefined,
    };
  };

  // Fetch all users
  const fetchUsers = async (skip: number = 0, limit: number = 100) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers(skip, limit);
      const mappedUsers = response.map(mapApiUserToUser);
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (err: any) {
      const errorDetails = showError(err, 'fetch users');
      setError(errorDetails.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create user with error handling
  const createUser = async (userData: any) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error: any) {
      showError(error, 'create user');
      throw error; // Re-throw so the component can handle specific logic
    }
  };

  // Update user with error handling
  const updateUser = async (userId: string, userData: any) => {
    try {
      const response = await userService.updateUser(userId, userData);
      return response;
    } catch (error: any) {
      showError(error, 'update user');
      throw error;
    }
  };

  // Delete user with error handling
  const deleteUser = async (userId: string) => {
    try {
      const response = await userService.deleteUser(userId);
      return response;
    } catch (error: any) {
      showError(error, 'delete user');
      throw error;
    }
  };

  // Add new user to the list after creation
  const addUserToList = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  // Update user in the list
  const updateUserInList = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  // Remove user from the list
  const removeUserFromList = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.filter(user => user.id !== userId)
    );
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    addUserToList,
    updateUserInList,
    removeUserFromList,
    setUsers
  };
};
