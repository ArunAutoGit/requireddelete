import axios from "axios";

interface CouponBatchRequest {
  product_id: number;
  quantity: number;
}

interface BatchResponse {
  batch_id: string;
  // Add other fields that the API returns
  [key: string]: any;
}

export async function createCouponBatch(data: CouponBatchRequest): Promise<BatchResponse> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const res = await axios.post<BatchResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/coupon/batches`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

interface PrintResponse {
  // Add the actual response fields you expect from the print API
  success: boolean;
  message?: string;
  // Add other fields as needed
  [key: string]: any;
}

export async function fetchBatchPrint(batchId: string): Promise<PrintResponse> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const res = await axios.get<PrintResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/coupon/batches/${batchId}/print`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
