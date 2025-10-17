// components/UserTable.tsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { User } from '../../../hooks/useUsers';
import { mapToDisplayRole } from '../../../utils/roleMapping';
import { UserTableProps } from '../../../types/user';

// interface UserTableProps {
//   users: User[];
//   currentUsers: User[];
//   t: any;
//   getStatusBadge: (status: string) => JSX.Element;
//   openUpdateForm: (user: User) => void;
//   openDeleteConfirm: (user: User) => void;
// }

export function UserTable({
  users,
  currentUsers,
  t,
  getStatusBadge,
  openUpdateForm,
  openDeleteConfirm
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t.noUsers}</p>
        </div>
      </div>
    );
  }

  // Helper function to get display location
  const getDisplayLocation = (user: User) => {
    const isPrinterUser = user.role.toLowerCase() === 'printer';
    
    if (isPrinterUser) {
      // For printer users, show address first, then plant location
      return (
        <div className="text-sm">
          {/* Address first */}
          {user.location ? (
            <div className="mb-1">
              {user.location}
            </div>
          ) : (
            <div className="mb-1 text-gray-500 dark:text-gray-400">
              No address provided
            </div>
          )}
          {/* Plant location below address */}
          {user.plantLocation ? (
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Plant: {user.plantLocation}  {/* This should show "Plant: 01" */}
            </div>
            ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">
                No plant assigned
            </div>
            )}
        </div>
      );
    } else {
      // For other users, show only address-based location
      return (
        <div className="text-sm">
          {user.location || (
            <span className="text-gray-500 dark:text-gray-400">No address provided</span>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Table Header - Fixed */}
      <div className="bg-[#0066cc] sticky top-0 z-10">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">{t.user}</th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">{t.role}</th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">{t.location}</th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">{t.created}</th>
              <th className="w-1/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">{t.actions}</th>
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Table Body - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full table-fixed">
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user) => {
              const displayRole = mapToDisplayRole(user.role);
              
              return (
                <tr key={user.id} className="hover:bg-[#fff9c4] dark:hover:bg-gray-700/50 text-gray-900 dark:text-white">
                  <td className="w-1/3 px-6 py-4">
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{user.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{user.mobile}</div>
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4">
                    <span className="text-sm truncate block">{t.roles[displayRole as keyof typeof t.roles] || displayRole}</span>
                  </td>
                  <td className="w-1/4 px-6 py-4">
                    <div className="overflow-hidden">
                      {getDisplayLocation(user)}
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4">
                    <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="w-1/12 px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openUpdateForm(user)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(user)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}