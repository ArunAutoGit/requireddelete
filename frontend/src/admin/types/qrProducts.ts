export interface QRCode {
  coupon_id: number;
  unique_num: string;
  qr_code_base64: string;
  status: string;
}

export interface Product {
  product_name: string;
  part_no: string;
  grade: string;
  net_qty_inner: number;
  size1: string | null;
  pkd_date: string;
  mrp_inner: number;
  mechanic_coupon_inner: number;
}

export interface ApiResponse {
  batch_id: number;
  product: Product;
  qr_codes: QRCode[];
  total_quantity: number;
  generated_at: string;
}

export interface LabelData {
  id: string;
  product: string;
  partNo: string;
  grade: string;
  size: string;
  netQty: string;
  pkd: string;
  mrp: string;
  amount: string;
  letter: string;
  qrCodeBase64: string;
}

export interface PrintPreviewProps {
  isDark: boolean;
  onTabChange: (tab: string) => void;
  language: "en" | "hi";
  printData?: ApiResponse;
}


export interface PrintControlsProps {
  isDark: boolean;
  label: any;
  onPrintSingle: (id: string) => void;
  onPrintBatch: () => void;
  printButtonText: string;
  showBatchButton?: boolean;
  batchCount?: number;
}