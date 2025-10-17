import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

// Raw API type (snake_case)
interface ProductApi {
  sl_no: number;
  location: string;
  cell: string;
  vehicle_application: string;
  segment_product: string;
  product_name: string;
  part_no: string;
  grade: string;
  size: string;
  net_qty_inner: number;
  net_qty_master: number;
  size1: string | null;
  mechanic_coupon_inner: number;
  mrp_inner: number;
  mrp_master: number;
  barcode: string;
  prd_code: string;
  padi_cell: string;
  tskp1_cell: string;
  tskp2_cell: string;
  lbl_status: boolean;
  product_id: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

// Frontend type (PascalCase, matches LabelGeneration.tsx)
export interface Product {
  Slno: string;
  Location: string;
  Cell: string;
  Vehicle_Application: string;
  Segment_product: string;
  Product: string;
  Part_No: string;
  Grade: string;
  Size: string;
  Net_Qty_Inner: string;
  Net_Qty_Master: string;
  Size1: string | null;
  Mechanic_Coupon_Inner: string;
  MRP_Inner: string;
  MRP_Master: string;
  Barcode: string;
  Prd_code: string;
  padi_cell: string;
  tskp1_cell: string;
  tskp2_cell: string;
  lbl_status: string;
  product_id: number;
}

// Mapper: API → UI
function mapProduct(api: ProductApi): Product {
  return {
    Slno: String(api.sl_no),
    Location: api.location,
    Cell: api.cell,
    Vehicle_Application: api.vehicle_application,
    Segment_product: api.segment_product,
    Product: api.product_name,
    Part_No: api.part_no,
    Grade: api.grade,
    Size: api.size,
    Net_Qty_Inner: String(api.net_qty_inner),
    Net_Qty_Master: String(api.net_qty_master),
    Size1: api.size1,
    Mechanic_Coupon_Inner: String(api.mechanic_coupon_inner),
    MRP_Inner: String(api.mrp_inner),
    MRP_Master: String(api.mrp_master),
    Barcode: api.barcode,
    Prd_code: api.prd_code,
    padi_cell: api.padi_cell,
    tskp1_cell: api.tskp1_cell,
    tskp2_cell: api.tskp2_cell,
    lbl_status: api.lbl_status ? "Active" : "Inactive",
    product_id: api.product_id,
  };
}

// API call
export async function fetchProducts(skip = 0, limit = 100): Promise<Product[]> {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }

  const res = await axios.get<ProductApi[]>(
    `${import.meta.env.VITE_API_BASE_URL}/productmaster/`, // ✅ env use pannuren
    {
      params: { skip, limit },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.map(mapProduct);
}
