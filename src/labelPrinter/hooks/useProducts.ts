import { useEffect, useState } from "react";
import { fetchProducts, Product } from "../services/productService";

export function useProducts(skip = 0, limit = 100) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProducts(skip, limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [skip, limit]);

  return { products, loading, error };
}
