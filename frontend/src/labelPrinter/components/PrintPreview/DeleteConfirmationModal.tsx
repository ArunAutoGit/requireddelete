// DeleteConfirmationModal.tsx
import React from "react";

interface DeleteConfirmationModalProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  title: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isDark,
  isOpen,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  title
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;