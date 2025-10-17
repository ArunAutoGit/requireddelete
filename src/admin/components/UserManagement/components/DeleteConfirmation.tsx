// components/DeleteConfirmation.tsx
import React from 'react';
import { X } from 'lucide-react';
import { User } from '../../../hooks/useUsers';
import { DeleteConfirmationProps } from '../../../types/query';

// interface DeleteConfirmationProps {
//   isOpen: boolean;
//   user: User | null;
//   t: any;
//   onClose: () => void;
//   onConfirm: () => void;
// }

export function DeleteConfirmation({
  isOpen,
  user,
  t,
  onClose,
  onConfirm
}: DeleteConfirmationProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.deleteUser}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">{t.confirmDelete}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.confirmDeleteDesc}</p>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            {t.cancel}
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.deleteUser}
          </button>
        </div>
      </div>
    </div>
  );
}