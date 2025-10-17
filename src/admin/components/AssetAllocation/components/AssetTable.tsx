// components/AssetTable.tsx
import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { Asset, AssetTableProps, ConfirmationModalProps } from '../../../types/asset';

// interface AssetTableProps {
//   assets: Asset[];
//   language: 'en' | 'hi';
//   onUnassign: (assetId: number) => void;
//   loading?: boolean;
// }

const translations = {
  en: {
    assetDetails: "Asset Details",
    typeCategory: "Type & Category",
    assignedTo: "Assigned To",
    userRole: "User Role",
    allocationDate: "Allocation Date",
    actions: "Actions",
    unassigned: "Unassigned",
    deallocate: "Deallocate",
    confirmDeallocation: "Confirm Deallocation",
    confirmMessage: "Are you sure you want to deallocate this asset? This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Deallocate",
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
    assetDetails: "संपत्ति विवरण",
    typeCategory: "प्रकार और श्रेणी",
    assignedTo: "को आवंटित",
    userRole: "उपयोगकर्ता भूमिका",
    allocationDate: "आवंटन दिनांक",
    actions: "कार्रवाइयाँ",
    unassigned: "अनावंटित",
    deallocate: "डीलोकेट",
    confirmDeallocation: "डीलोकेशन की पुष्टि करें",
    confirmMessage: "क्या आप वाकई इस संपत्ति को डीलोकेट करना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
    cancel: "रद्द करें",
    confirm: "डीलोकेट करें",
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

// Confirmation Modal Component
// interface ConfirmationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   assetName: string;
//   language: 'en' | 'hi';
// }

function ConfirmationModal({ isOpen, onClose, onConfirm, assetName, language }: ConfirmationModalProps) {
  const t = translations[language];
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.confirmDeallocation}</h3>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">{t.confirmMessage}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Asset: {assetName}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AssetTable({ assets, language, onUnassign, loading }: AssetTableProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  const t = translations[language];

  const getCategoryIcon = (category: string) => {
    const icons = {
      laptop: Laptop,
      mobile: Smartphone,
      tablet: Tablet
    };
    const Icon = icons[category as keyof typeof icons] || Laptop;
    return <Icon className="h-5 w-5" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return <span className="text-sm text-gray-500">-</span>;
    
    const roleClasses = {
      msr: 'bg-purple-100 text-purple-800',
      finance: 'bg-green-100 text-green-800',
      statehead: 'bg-blue-100 text-blue-800',
      zonalhead: 'bg-orange-100 text-orange-800',
      printer: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleClasses[role as keyof typeof roleClasses] || 'bg-gray-100 text-gray-800'}`}>
        {t.roles[role as keyof typeof t.roles] || role.toUpperCase()}
      </span>
    );
  };

  const handleDeallocateClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowConfirmModal(true);
  };

  const handleConfirmDeallocation = () => {
    if (selectedAsset) {
      onUnassign(selectedAsset.asset_id);
      setShowConfirmModal(false);
      setSelectedAsset(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setSelectedAsset(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center text-gray-500">Loading assets...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0066cc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t.assetDetails}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t.typeCategory}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t.assignedTo}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t.userRole}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t.allocationDate}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                    {t.actions}
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.asset_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getCategoryIcon(asset.asset_type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.asset_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          S/N: {asset.asset_serial_number || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Model: {asset.asset_model || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#0066cc]/10 text-[#0066cc]">
                      {t.categories[asset.asset_type as keyof typeof t.categories]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {asset.assigned_to ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.user_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {asset.assigned_to}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.assigned_location}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">{t.unassigned}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(asset.user_role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(asset.allocated_on)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                        {asset.assigned_to && (
                        <button
                            onClick={() => handleDeallocateClick(asset)}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                            {t.deallocate}
                        </button>
                        )}
                    </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDeallocation}
        assetName={selectedAsset?.asset_name || ''}
        language={language}
      />
    </>
  );
}
