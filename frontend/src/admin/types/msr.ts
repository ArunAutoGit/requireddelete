
export interface MSRApprovalProps {
  language?: "en" | "hi";
}

export interface MSRApiResponse {
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
  user_id: number;
  status: boolean;
  onboarding_status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  onboarder: {
    name: string;
    email: string;
    mobile: string;
    user_id: number;
  };
}
