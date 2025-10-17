

export interface LoginProps {
  isDark?: boolean;
  language?: "en" | "hi";
  onLanguageToggle?: () => void;
}

export interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export interface UseAuthReturn {
  // State
  isLoading: boolean;
  error: string | null;
  success: boolean;

  // Actions
  requestOtp: (email: string) => Promise<void>;
  validateOtp: (email: string, otp: string) => Promise<void>;
  setNewPassword: (email: string, newPassword: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ValidateOtpResponse {
  message: string;
}

export interface SetNewPasswordResponse {
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Finance" | "PrinterUser";
  location?: string;
  mobile?: string;
  bankAccount?: string;
  status: "Active" | "Pending" | "Inactive";
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}