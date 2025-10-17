// services/assetService.ts
import axios from 'axios';
import { 
  Asset, 
  AssetCreate, 
  AssetUpdate, 
  AssetListResponse,
  AssetAllocationForm 
} from '../types/asset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const assetService = {
  listAssets: async (params?: {
    skip?: number;
    limit?: number;
    asset_type?: string;
    user_id?: number;
    search?: string;
  }): Promise<AssetListResponse> => {
    try {
      const { skip = 0, limit = 100, asset_type, user_id, search } = params || {};
      
      let url = `/assets/?skip=${skip}&limit=${limit}`;
      if (asset_type) url += `&asset_type=${asset_type}`;
      if (user_id) url += `&user_id=${user_id}`;
      if (search) url += `&search=${search}`;

      const response = await api.get<AssetListResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error while fetching assets');
      }
      throw error;
    }
  },

  getAsset: async (id: number): Promise<Asset> => {
    try {
      const response = await api.get<Asset>(`/assets/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Asset not found');
      }
      throw error;
    }
  },

  // services/assetService.ts
  allocateAsset: async (assetData: AssetAllocationForm): Promise<Asset> => {
    try {
      const createData = {
        asset_name: assetData.asset_name,
        asset_type: assetData.asset_type,
        asset_serial_number: assetData.asset_serial_number,
        asset_model: assetData.asset_model,
        assigned_to: assetData.assigned_to,
        status: 'allocated'
      };

      console.log('Sending asset data:', createData); // Debug log

      const response = await api.post<Asset>('/assets/', createData);
      console.log('Asset created successfully:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Asset creation error:', error.response?.data || error.message);
      if (error.response?.status === 409) {
        throw new Error('Asset with this serial number already exists');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid input data');
      }
      throw error;
    }
  },

  updateAssetAllocation: async (id: number, updates: Partial<AssetAllocationForm>): Promise<Asset> => {
    try {
      const updateData: AssetUpdate = {
        asset_name: updates.asset_name,
        asset_type: updates.asset_type,
        asset_serial_number: updates.asset_serial_number,
        asset_model: updates.asset_model,
        assigned_to: updates.assigned_to
      };

      const response = await api.put<Asset>(`/assets/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Asset with this serial number already exists');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid input data');
      } else if (error.response?.status === 404) {
        throw new Error('Asset not found');
      }
      throw error;
    }
  },

  deleteAssetAllocation: async (id: number): Promise<void> => {
    try {
      await api.delete(`/assets/${id}`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Cannot delete asset due to existing references');
      } else if (error.response?.status === 404) {
        throw new Error('Asset not found');
      }
      throw error;
    }
  },

  getAssetsByUser: async (userId: number): Promise<Asset[]> => {
    try {
      const response = await assetService.listAssets({ user_id: userId, limit: 1000 });
      return response.assets;
    } catch (error: any) {
      throw error;
    }
  },

  getAssetsByType: async (assetType: string): Promise<Asset[]> => {
    try {
      const response = await assetService.listAssets({ asset_type: assetType, limit: 1000 });
      return response.assets;
    } catch (error: any) {
      throw error;
    }
  },

  searchAssets: async (searchTerm: string): Promise<Asset[]> => {
    try {
      const response = await assetService.listAssets({ search: searchTerm, limit: 1000 });
      return response.assets;
    } catch (error: any) {
      throw error;
    }
  },
};