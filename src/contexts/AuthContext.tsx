import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../admin/types/login';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'Admin' | 'Finance' | 'PrinterUser';
//   location?: string;
//   mobile?: string;
//   bankAccount?: string;
//   status: 'Active' | 'Pending' | 'Inactive';
//   createdAt: string;
//   lastLogin?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   isLoading: boolean;
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', '');

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token } = data;
        
        const decodedPayload = decodeJWT(access_token);
        if (!decodedPayload) {
          setIsLoading(false);
          return false;
        }

        // Debug logging
        console.log('JWT Payload:', decodedPayload);
        console.log('Backend Role:', decodedPayload.role);

        // Correct role mapping based on your backend roles
        const roleMapping: { [key: string]: 'Admin' | 'Finance' | 'PrinterUser' } = {
          'admin': 'Admin',
          'finance': 'Finance',
          'printer': 'PrinterUser',
        };

        const mappedRole = roleMapping[decodedPayload.role];
        
        if (!mappedRole) {
          console.error('Unknown role from backend:', decodedPayload.role);
          setIsLoading(false);
          return false;
        }

        console.log('Mapped Role:', mappedRole);

        const userObj: User = {
          id: decodedPayload.sub,
          email,
          role: mappedRole,
          name: email.split('@')[0],
          status: 'Active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        console.log('Final User Object:', userObj);

        setToken(access_token);
        setUser(userObj);
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('authUser', JSON.stringify(userObj));
        
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  
  // Navigate to root after logout
  window.location.href = '/';
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
