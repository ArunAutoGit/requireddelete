import { User } from "./user";

// types/asset.ts
export type AssetType = 'laptop' | 'mobile' | 'tablet';
export type UserRole = 'msr' | 'finance' | 'statehead' | 'zonalhead' | 'printer';

export interface Asset {
  asset_id: number;
  asset_name: string;
  asset_type: AssetType;
  asset_serial_number?: string;
  asset_model?: string;
  asset_specifications?: string;
  assigned_to?: number;
  allocated_on?: string;
  status: 'available' | 'allocated' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  
  // User details (from backend)
  user_name?: string;
  user_role?: string;
  user_email?: string;
  user_mobile?: string;
}


export interface AssetCreate {
  asset_name: string;
  asset_type: AssetType;
  asset_serial_number?: string;
  asset_model?: string;
  assigned_to?: number;
  assigned_location?: string;
  status?: 'available' | 'allocated';
}

export interface AssetUpdate {
  asset_name?: string;
  asset_type?: AssetType;
  asset_serial_number?: string;
  asset_model?: string;
  assigned_to?: number;
  assigned_location?: string;
  status?: 'available' | 'allocated' | 'maintenance' | 'retired';
}

export interface AssetListResponse {
  total: number;
  assets: Asset[];
}

export interface AssetAllocationForm {
  asset_name: string;
  asset_type: AssetType;
  asset_serial_number: string;
  asset_model: string;
  assigned_to: number;
}


export interface AssetAllocationProps {
  language: "en" | "hi";
}

export interface ToastState {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
}

export interface AssetAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAllocated?: () => void;
  users: User[];
  language: 'en' | 'hi';
}

export interface AssetTableProps {
  assets: Asset[];
  language: "en" | "hi";
  onUnassign: (assetId: number) => void;
  loading?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName: string;
  language: "en" | "hi";
}