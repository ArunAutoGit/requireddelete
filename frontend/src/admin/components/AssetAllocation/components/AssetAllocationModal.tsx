// components/AssetAllocationModal.tsx
import React, { useState } from 'react';
import { useAssets } from '../../../hooks/useAssets';
import { AssetAllocationModalProps, AssetAllocationForm as AssetForm, AssetType } from '../../../types/asset';
import { ASSET_TYPES } from '../../../utils/constants';
import toast from 'react-hot-toast';
// import { useUsers, type User } from '../../../hooks/useUsers';  

// interface AssetAllocationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAssetAllocated?: () => void;
//   users: User[];
//   language: 'en' | 'hi';
// }

const translations = {
  en: {
    allocateAsset: "Allocate Asset",
    assetName: "Asset Name",
    assetType: "Asset Type",
    serialNumber: "Serial Number",
    model: "Model",
    assignTo: "Assign To",
    requiredFields: "Please fill all required fields!",
    assetAllocated: "Asset allocated successfully!",
    cancel: "Cancel",
    allocate: "Allocate",
    chooseUser: "Choose a user...",
    chooseType: "Choose asset type...",
    noUsersAvailable: "No eligible users available"
  },
  hi: {
    allocateAsset: "संपत्ति आवंटित करें",
    assetName: "संपत्ति का नाम",
    assetType: "संपत्ति प्रकार",
    serialNumber: "सीरियल नंबर",
    model: "मॉडल",
    assignTo: "को आवंटित करें",
    requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें!",
    assetAllocated: "संपत्ति सफलतापूर्वक आवंटित की गई!",
    cancel: "रद्द करें",
    allocate: "आवंटित करें",
    chooseUser: "उपयोगकर्ता चुनें...",
    chooseType: "संपत्ति प्रकार चुनें...",
    noUsersAvailable: "कोई योग्य उपयोगकर्ता उपलब्ध नहीं"
  }
};

export function AssetAllocationModal({ isOpen, onClose, onAssetAllocated, users, language }: AssetAllocationModalProps) {
  const { allocateAsset, loading } = useAssets();
  const [formData, setFormData] = useState<AssetForm>({
    asset_name: '',
    asset_type: 'laptop',
    asset_serial_number: '',
    asset_model: '',
    assigned_to: 0,
  });

  const t = translations[language];

  // Define allowed roles for asset allocation
  const allowedRoles = ['msr', 'statehead', 'zonalhead', 'finance', 'printer'];

  // Filter users to only show allowed roles
  const filteredUsers = users.filter(user => 
    allowedRoles.includes(user.role.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.asset_name || !formData.asset_serial_number || !formData.asset_model || 
        !formData.assigned_to ) {
      toast.error(t.requiredFields);
      return;
    }

    try {
      console.log('Submitting form data:', formData); // Debug log
      const newAsset = await allocateAsset(formData);
      toast.success(t.assetAllocated);
      
      // Reset form
      setFormData({
        asset_name: '',
        asset_type: 'laptop',
        asset_serial_number: '',
        asset_model: '',
        assigned_to: 0
      });
      
      if (onAssetAllocated) {
        onAssetAllocated(); // Let parent refresh the list
      }
      
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);
      // Error is handled in the hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.allocateAsset}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.assetName} *
            </label>
            <input
              type="text"
              value={formData.asset_name}
              onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.assetType} *
            </label>
            <select
              value={formData.asset_type}
              onChange={(e) => setFormData({ ...formData, asset_type: e.target.value as AssetType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
              required
            >
              <option value="">{t.chooseType}</option>
              {ASSET_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.serialNumber} *
            </label>
            <input
              type="text"
              value={formData.asset_serial_number}
              onChange={(e) => setFormData({ ...formData, asset_serial_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.model} *
            </label>
            <input
              type="text"
              value={formData.asset_model}
              onChange={(e) => setFormData({ ...formData, asset_model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.assignTo} *
            </label>
            <select
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
              required
            >
              <option value="">{t.chooseUser}</option>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role.toUpperCase()}) 
                  </option>
                ))
              ) : (
                <option value="" disabled>{t.noUsersAvailable}</option>
              )}
            </select>
            {filteredUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Only MSR, State Head, Zonal Head, Finance, and Printer users can be assigned assets.
              </p>
            )}
          </div>
        <div>
        </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading || filteredUsers.length === 0}
              className="px-4 py-2 bg-[#0066cc] hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Allocating...' : t.allocate}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
