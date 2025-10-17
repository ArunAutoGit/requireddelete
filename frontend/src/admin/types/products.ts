export interface ProductMaster {
  product_id: number;
  sl_no?: number;
  location?: string;
  cell?: string;
  vehicle_application?: string;
  segment_product?: string;
  product_name: string;
  part_no?: string;
  grade?: string;
  size?: string;
  net_qty_inner?: number;
  net_qty_master?: number;
  size1?: string;
  mechanic_coupon_inner?: number;
  mrp_inner?: number;
  mrp_master?: number;
  barcode?: string;
  prd_code?: string;
  padi_cell?: string;
  tskp1_cell?: string;
  tskp2_cell?: string;
  lbl_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductMasterCreate {
  sl_no?: number;
  location?: string;
  cell?: string;
  vehicle_application?: string;
  segment_product?: string;
  product_name: string;
  part_no?: string;
  grade?: string;
  size?: string;
  net_qty_inner?: number;
  net_qty_master?: number;
  size1?: string;
  mechanic_coupon_inner?: number;
  mrp_inner?: number;
  mrp_master?: number;
  barcode?: string;
  prd_code?: string;
  padi_cell?: string;
  tskp1_cell?: string;
  tskp2_cell?: string;
  lbl_status?: boolean;
}

export interface ProductMasterUpdate {
  sl_no?: number;
  location?: string;
  cell?: string;
  vehicle_application?: string;
  segment_product?: string;
  product_name?: string;
  part_no?: string;
  grade?: string;
  size?: string;
  net_qty_inner?: number;
  net_qty_master?: number;
  size1?: string;
  mechanic_coupon_inner?: number;
  mrp_inner?: number;
  mrp_master?: number;
  barcode?: string;
  prd_code?: string;
  padi_cell?: string;
  tskp1_cell?: string;
  tskp2_cell?: string;
  lbl_status?: boolean;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface BulkDeleteRequest {
  product_ids: number[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  statusCode: number;
}
export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductMasterCreate) => void;
  language: "en" | "hi";
  isSaving: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  language: "en" | "hi";
  isDeleting: boolean;
  isBulk?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  language: "en" | "hi";
}

export interface ProductTableProps {
  products: ProductMaster[];
  selectedProducts: number[];
  onSelectProduct: (id: number) => void;
  onSelectAll: () => void;
  onDeleteProduct: (id: number) => void;
  language: "en" | "hi";
  loading?: boolean;
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
}

export interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  onExport: () => void;
  isExporting: boolean;
  language: "en" | "hi";
}
export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  language: "en" | "hi";
  isUploading: boolean;
}