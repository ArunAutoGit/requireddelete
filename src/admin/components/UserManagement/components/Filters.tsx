// components/Filters.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { FormUserRole } from '../../../types/user';
import { FiltersProps } from '../../../types/filter';

// interface FiltersProps {
//   searchTerm: string;
//   selectedRole: FormUserRole | 'all';
//   selectedStatus: string;
//   itemsPerPage: number;
//   t: any;
//   onSearchChange: (term: string) => void;
//   onRoleChange: (role: FormUserRole | 'all') => void;
//   onStatusChange: (status: string) => void;
//   onItemsPerPageChange: (items: number) => void;
// }

export function Filters({
  searchTerm,
  selectedRole,
  selectedStatus,
  itemsPerPage,
  t,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onItemsPerPageChange
}: FiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchUsers}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 
                       dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value as FormUserRole | 'all')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     dark:bg-gray-700 dark:text-white"
        >
          <option value="all">{t.allRoles}</option>
          <option value="Admin">{t.roles.Admin}</option>
          <option value="Finance">{t.roles.Finance}</option>
          <option value="Zonal Head">{t.roles['Zonal Head']}</option>
          <option value="State Head">{t.roles['State Head']}</option>
          <option value="PrinterUser">{t.roles.PrinterUser}</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     dark:bg-gray-700 dark:text-white"
        >
          <option value="all">{t.allStatus}</option>
          <option value="Active">{t.statuses.Active}</option>
          <option value="Pending">{t.statuses.Pending}</option>
          <option value="Inactive">{t.statuses.Inactive}</option>
        </select>

        {/* Items per page */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {t.rowsPerPage}
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       dark:bg-gray-700 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}