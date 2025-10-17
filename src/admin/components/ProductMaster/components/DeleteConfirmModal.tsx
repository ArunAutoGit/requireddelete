// components/products/DeleteConfirmModal.tsx
import React from 'react';
import { DeleteConfirmModalProps } from '../../../types/products';

// interface DeleteConfirmModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   productName: string;
//   language: 'en' | 'hi';
//   isDeleting: boolean;
//   isBulk?: boolean;
// }

const translations = {
  en: {
    singleTitle: "Confirm Delete",
    bulkTitle: "Confirm Bulk Delete",
    singleMessage: "Are you sure you want to delete this product? This action cannot be undone.",
    bulkMessage: "Are you sure you want to delete the selected products? This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    deleteAll: "Delete All",
    deleting: "Deleting...",
    product: "Product:",
    selectedProducts: "Selected Products:"
  },
  hi: {
    singleTitle: "पुष्टि करें",
    bulkTitle: "बल्क डिलीट की पुष्टि करें",
    singleMessage: "क्या आप वाकई इस उत्पाद को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।",
    bulkMessage: "क्या आप वाकई चयनित उत्पादों को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।",
    cancel: "रद्द करें",
    delete: "हटाएं",
    deleteAll: "सभी हटाएं",
    deleting: "हटा रहा है...",
    product: "उत्पाद:",
    selectedProducts: "चयनित उत्पाद:"
  }
};

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  language, 
  isDeleting, 
  isBulk = false 
}: DeleteConfirmModalProps) {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isBulk ? t.bulkTitle : t.singleTitle}
        </h3>
        <p className="text-gray-600 mb-2">
          {isBulk ? t.bulkMessage : t.singleMessage}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-medium">
            {isBulk ? t.selectedProducts : t.product} 
          </span> {productName}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting 
              ? t.deleting 
              : (isBulk ? t.deleteAll : t.delete)
            }
          </button>
        </div>
      </div>
    </div>
  );
}
