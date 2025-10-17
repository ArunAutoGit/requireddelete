import { useState, useCallback } from 'react';
import { productService } from '../services/productService';
import { ProductMaster, ProductMasterCreate, ProductMasterUpdate, PaginationParams } from '../types/products';

// Hook for creating a product
export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductMaster | null>(null);

  const execute = useCallback(async (productData: ProductMasterCreate) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.createProduct(productData);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for uploading Excel
export const useUploadExcel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductMaster[] | null>(null);

  const execute = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.uploadExcel(file);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for listing products
export const useListProducts = (initialParams: PaginationParams = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductMaster[] | null>(null);

  const execute = useCallback(async (params?: PaginationParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.listProducts(params || initialParams);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [initialParams]);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for getting a single product
export const useGetProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductMaster | null>(null);

  const execute = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.getProduct(id);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for updating a product
export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductMaster | null>(null);

  const execute = useCallback(async (id: number, updates: ProductMasterUpdate) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.updateProduct(id, updates);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for bulk deleting products
export const useBulkDeleteProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ message: string } | null>(null);

  const execute = useCallback(async (productIds: number[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.bulkDeleteProducts(productIds);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Hook for deleting a single product
export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ message: string } | null>(null);

  const execute = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.deleteProduct(id);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};
