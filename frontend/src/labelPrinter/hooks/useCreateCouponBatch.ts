import { useState, useCallback } from "react";
import { createCouponBatch, fetchBatchPrint } from "../services/couponService";

export function useCreateCouponBatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const createBatch = useCallback(async (product_id: number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Create batch
      const batchRes = await createCouponBatch({ product_id, quantity });

      // 2️⃣ Extract batch_id
      const batchId = batchRes.batch_id;

      // 3️⃣ Call print API
      const printRes = await fetchBatchPrint(batchId);

      // 4️⃣ Save both
      setResult({ batch: batchRes, print: printRes });

      return { batch: batchRes, print: printRes };
    } catch (err: any) {
      setError(err.message || "Failed to create batch");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBatch, loading, error, result };
}
