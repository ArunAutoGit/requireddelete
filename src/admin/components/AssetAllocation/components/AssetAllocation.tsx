// components/AssetAllocation.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useAssets } from '../../../hooks/useAssets';
import { useUsers } from '../../../hooks/useUsers';
import { AssetAllocationModal } from './AssetAllocationModal';
import { AssetTable } from './AssetTable';
import { Toast } from './Toast';
import { AssetAllocationProps, AssetType, ToastState, UserRole } from '../../../types/asset';
import { exportAssetsWithSummary } from '../../../utils/excelExport';

// interface AssetAllocationProps {
//   language: 'en' | 'hi';
// }

// interface ToastState {
//   message: string;
//   type: 'success' | 'error';
//   isVisible: boolean;
// }

const translations = {
  en: {
    title: "Asset Allocation",
    subtitle: "Manage and track device assignments",
    addAsset: "Allocate Asset",
    searchPlaceholder: "Search assets...",
    allCategories: "All Categories",
    allRoles: "All Roles",
    export: "Export to Excel",
    exporting: "Exporting...",
    categories: {
      laptop: "Laptop",
      mobile: "Mobile",
      tablet: "Tablet"
    },
    roles: {
      msr: "MSR",
      finance: "Finance",
      statehead: "State Head",
      zonalhead: "Zonal Head",
      printer: "Printer User"
    }
  },
  hi: {
    title: "संपत्ति आवंटन",
    subtitle: "डिवाइस असाइनमेंट प्रबंधित और ट्रैक करें",
    addAsset: "संपत्ति आवंटित करें",
    searchPlaceholder: "संपत्तियां खोजें...",
    allCategories: "सभी श्रेणियां",
    allRoles: "सभी भूमिकाएं",
    export: "एक्सेल में निर्यात करें",
    exporting: "निर्यात हो रहा...",
    categories: {
      laptop: "लैपटॉप",
      mobile: "मोबाइल",
      tablet: "टैबलेट"
    },
    roles: {
      msr: "एमएसआर",
      finance: "वित्त",
      statehead: "राज्य प्रमुख",
      zonalhead: "क्षेत्रीय प्रमुख",
      printer: "प्रिंटर उपयोगकर्ता"
    }
  }
};

export function AssetAllocation({ language }: AssetAllocationProps) {
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const { assets, loading, error, deleteAssetAllocation, loadAssets } = useAssets();
  const { users } = useUsers();

  const t = translations[language];

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.asset_type === selectedCategory;
    const matchesRole = selectedRole === 'all' || asset.user_role === selectedRole;
    
    return matchesSearch && matchesCategory && matchesRole;
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleUnassign = async (assetId: number) => {
    try {
      await deleteAssetAllocation(assetId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAssetAllocated = () => {
    loadAssets();
  };

  const handleExport = async () => {
    if (filteredAssets.length === 0) {
      showToast('No data available to export', 'error');
      return;
    }

    setIsExporting(true);
    try {
      const result = exportAssetsWithSummary(
        filteredAssets,
        {
          searchTerm,
          category: selectedCategory,
          role: selectedRole
        }
      );

      showToast(`Excel file downloaded successfully! ${result.rowCount} records exported.`, 'success');
      
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setShowAllocateModal(true)}
          className="bg-[#0066cc] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t.addAsset}</span>
        </button>
      </div>


      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
          >
            <option value="all">{t.allCategories}</option>
            <option value="laptop">{t.categories.laptop}</option>
            <option value="mobile">{t.categories.mobile}</option>
            <option value="tablet">{t.categories.tablet}</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
          >
            <option value="all">{t.allRoles}</option>
            <option value="msr">{t.roles.msr}</option>
            <option value="finance">{t.roles.finance}</option>
            <option value="statehead">{t.roles.statehead}</option>
            <option value="zonalhead">{t.roles.zonalhead}</option>
            <option value="printer">{t.roles.printer}</option>
          </select>

          <div className="flex space-x-2">
            <button 
              onClick={handleExport}
              disabled={isExporting || filteredAssets.length === 0}
              className="flex-1 bg-[#ffff4d] hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? t.exporting : t.export}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <AssetTable
        assets={filteredAssets}
        language={language}
        onUnassign={handleUnassign}
        loading={loading}
      />

      {/* Allocation Modal */}
      <AssetAllocationModal
        isOpen={showAllocateModal}
        onClose={() => setShowAllocateModal(false)}
        onAssetAllocated={handleAssetAllocated}
        users={users}
        language={language}
      />
    </div>
  );
}
