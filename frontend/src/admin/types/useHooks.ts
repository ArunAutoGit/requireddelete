import { Asset, AssetAllocationForm, AssetType } from "./asset";
import { MSRApiResponse } from "./msr";

export interface UseAdminKPIResult {
  data: AdminKPIResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface AdminKPIResponse {
  total_approved_msr: number;
  pending_msr_approvals: number;
  total_products: number;
}

export interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  allocatedAsset: Asset | null;
  allocateAsset: (formData: AssetAllocationForm) => Promise<Asset>;
  updateAssetAllocation: (assetId: number, formData: Partial<AssetAllocationForm>) => Promise<Asset>;
  deleteAssetAllocation: (assetId: number) => Promise<void>;
  loadAssets: (filters?: { asset_type?: AssetType; user_id?: number; search?: string }) => Promise<void>;
  clearError: () => void;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  message?: string;
  // Add other fields that your API returns
}

export interface ErrorDetails {
  message: string;
  status?: number;
  field?: string;
}


export interface UseMSRApprovalReturn {
  msrData: MSRApiResponse[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateMSRStatus: (userId: number, status: boolean, rejectionReason?: string) => Promise<void>;
}

export interface UsePrinterKPIResult {
  data: PrinterKPIResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}