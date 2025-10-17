import axios from 'axios';
import { 
  ProductMaster, 
  ProductMasterCreate, 
  ProductMasterUpdate, 
  PaginationParams
} from '../types/products';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productService = {
  // Create single product
  createProduct: async (productData: ProductMasterCreate): Promise<ProductMaster> => {
    try {
      const response = await api.post<ProductMaster>('/productmaster/', productData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Upload Excel for bulk create
  uploadExcel: async (file: File): Promise<ProductMaster[]> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ProductMaster[]>('/productmaster/upload_excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error uploading Excel:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // List all products
  listProducts: async (params: PaginationParams = {}): Promise<ProductMaster[]> => {
    try {
      const { skip = 0, limit = 100 } = params;
      const response = await api.get<ProductMaster[]>(`/productmaster/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (id: number): Promise<ProductMaster> => {
    try {
      const response = await api.get<ProductMaster>(`/productmaster/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: number, updates: ProductMasterUpdate): Promise<ProductMaster> => {
    try {
      const response = await api.patch<ProductMaster>(`/productmaster/${id}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Delete single product
  deleteProduct: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(`/productmaster/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

    // Bulk delete products - Using POST method instead
    bulkDeleteProducts: async (productIds: number[]): Promise<{ message: string }> => {
    try {
        const response = await api.post<{ message: string }>('/productmaster/bulk-delete/', {
        product_ids: productIds
        });
        return response.data;
    } catch (error: any) {
        console.error('Error bulk deleting products:', error);
        if (error?.response?.data) {
        console.error('Error details:', error.response.data);
        }
        throw error;
    }
    },
};