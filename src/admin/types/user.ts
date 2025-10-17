// types/user.ts
export type FormUserRole =
  | "Admin"
  | "Finance"
  | "PrinterUser"
  | "Zonal Head"
  | "State Head";

export interface NewUserForm {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: FormUserRole;

  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  pincode?: string;

  // Plant location for printer users only
  plantLocation?: string;

  // Company/Bank fields
  companyName?: string;
  bankName?: string;
  accountHolderName?: string;
  bankAccount?: string;
  ifsc?: string;

  // New field for VPA
  vpa?: string;

  status?: "Active" | "Pending" | "Inactive";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  status: string;
  createdAt: string;

  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  pincode?: string;
  location?: string;
  latitude?: number;
  longitude?: number;

  // Plant location specifically for printer users
  plantLocation?: string;

  // Company/Bank fields
  companyName?: string;
  bankAccount?: string;
  bankName?: string;
  accountHolderName?: string;
  ifsc?: string;

  // New field for VPA
  vpa?: string;

  // Additional fields from API
  tNo?: string;
  designation?: string;
  hq?: string;
  responsibility?: string;
  reportsTo?: number;
}

export interface ApiUser {
  t_no: string | null;
  name: string;
  designation: string | null;
  hq: string | null;
  responsibility: string | null;
  role: string;
  reports_to: number | null;
  email: string | null;
  mobile: string | null;
  address_line1: string | null;
  address_line2: string | null;
  state: string | null;
  district: string | null;
  pincode: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  company_name: string | null;
  bank_account_holder: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_ifsc_code: string | null;

  // New field for VPA
  vpa_id: string | null;

  user_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFormProps {
  isOpen: boolean;
  isUpdate?: boolean;
  userData: NewUserForm;
  t: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onUserDataChange: (data: NewUserForm) => void;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  pincode?: string;
  password?: string;
  bankAccount?: string;
  ifsc?: string;
  vpa?: string;
  bankOrVpa?: string;
}

export interface UserTableProps {
  users: User[];
  currentUsers: User[];
  t: any;
  getStatusBadge: (status: string) => JSX.Element;
  openUpdateForm: (user: User) => void;
  openDeleteConfirm: (user: User) => void;
}

export interface UserPayload {
  name: string;
  role: string;
  email: string;
  mobile: string;

  address_line1?: string;
  address_line2?: string;
  state?: string;
  district?: string;
  pincode?: string;
  location?: string;
  latitude?: number;
  longitude?: number;

  company_name?: string;
  bank_account_holder?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;

  // New field for VPA
  vpa_id?: string;

  password: string; // required for creation
  reports_to: number;
}

export interface ApiUserResponse {
  t_no: string | null;
  name: string;
  designation: string | null;
  hq: string | null;
  responsibility: string | null;
  role: string;
  reports_to: number | null;
  email: string | null;
  mobile: string | null;
  address_line1: string | null;
  address_line2: string | null;
  state: string | null;
  district: string | null;
  pincode: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  company_name: string | null;
  bank_account_holder: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_ifsc_code: string | null;

  // New field for VPA
  vpa_id: string | null;
  onboarding_status: string;
  user_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface FastAPIValidationError {
  detail:
    | Array<{
        loc: (string | number)[];
        msg: string;
        type: string;
        input?: any;
        ctx?: Record<string, any>;
      }>
    | string;
}
