export interface ProductDetails {
  product_name: string;
  part_no: string;
  grade: string;
}

export interface CouponBatchOut {
  batch_id: number;
  product_id: number;
  quantity: number;
  coupon_value: number;
  qr_prefix?: string;
  total_cost: number;
  status: string;
  created_at: string;
  created_by?: number;
}

export interface CouponBatchWithProductOut extends CouponBatchOut {
  product_details: ProductDetails;
}

// Filter types
export interface BatchFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  productName?: string;
}

export interface BatchFiltersProps {
  onFilterChange: (filters: BatchFilters) => void;
  onClear: () => void;
  isDark: boolean;
  language: "en" | "hi";
  activeFilters?: BatchFilters;
}

export interface BatchDashboardProps {
  isDark: boolean;
  language: "en" | "hi";
  onTabChange?: (tab: string, data?: any) => void; // Add this prop
}

export interface BatchCardProps {
  batch: CouponBatchWithProductOut;
  isDark: boolean;
  language: "en" | "hi";
  onPrintClick?: (batchId: number) => void; // Add this prop
}