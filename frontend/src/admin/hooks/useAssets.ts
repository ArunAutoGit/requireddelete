// hooks/useAssets.ts - Remove the automatic loadAssets call from allocateAsset
import { useState, useCallback } from 'react';
import { Asset, AssetAllocationForm, AssetType } from '../types/asset';
import { assetService } from '../services/assetService';
import toast from 'react-hot-toast';
import { UseAssetsReturn } from '../types/useHooks';

// interface UseAssetsReturn {
//   assets: Asset[];
//   loading: boolean;
//   error: string | null;
//   allocatedAsset: Asset | null;
//   allocateAsset: (formData: AssetAllocationForm) => Promise<Asset>;
//   updateAssetAllocation: (assetId: number, formData: Partial<AssetAllocationForm>) => Promise<Asset>;
//   deleteAssetAllocation: (assetId: number) => Promise<void>;
//   loadAssets: (filters?: { asset_type?: AssetType; user_id?: number; search?: string }) => Promise<void>;
//   clearError: () => void;
// }

export const useAssets = (): UseAssetsReturn => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allocatedAsset, setAllocatedAsset] = useState<Asset | null>(null);

  const loadAssets = useCallback(async (filters?: { asset_type?: AssetType; user_id?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assetService.listAssets({
        asset_type: filters?.asset_type,
        user_id: filters?.user_id,
        search: filters?.search,
        limit: 1000
      });
      setAssets(response.assets);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load assets';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const allocateAsset = useCallback(async (formData: AssetAllocationForm): Promise<Asset> => {
    setLoading(true);
    setError(null);
    try {
      const newAsset = await assetService.allocateAsset(formData);
      setAllocatedAsset(newAsset);
      // Don't automatically reload here - let the parent component handle it
      return newAsset;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to allocate asset';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAssetAllocation = useCallback(async (assetId: number, formData: Partial<AssetAllocationForm>): Promise<Asset> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAsset = await assetService.updateAssetAllocation(assetId, formData);
      setAssets(prev => prev.map(asset => 
        asset.asset_id === assetId ? updatedAsset : asset
      ));
      return updatedAsset;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update asset allocation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAssetAllocation = useCallback(async (assetId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await assetService.deleteAssetAllocation(assetId);
      setAssets(prev => prev.filter(asset => asset.asset_id !== assetId));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete asset allocation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    assets,
    loading,
    error,
    allocatedAsset,
    allocateAsset,
    updateAssetAllocation,
    deleteAssetAllocation,
    loadAssets,
    clearError,
  };
};
