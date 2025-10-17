/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Plus, Search, X, Eye, EyeOff, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useUsers, User } from '../../hooks/useUsers';
import React from 'react';

// Import the extracted components
import { UserTable } from './components/UserTable';
import { Pagination } from './components/Pagination';
import { UserForm } from './components/UserForm';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { Filters } from './components/Filters';
import { mapToApiRole, mapToDisplayRole } from '../../utils/roleMapping';
import { validateEmail } from '../../utils/validation';
import { FormUserRole, NewUserForm } from "../../types/user";

// All possible roles in the form

// type FormUserRole = 'Admin' | 'Finance' | 'PrinterUser' | 'Zonal Head' | 'State Head';

// interface NewUserForm {
//   name: string;
//   email: string;
//   password: string;
//   mobile: string;
//   role: FormUserRole;
//   // Address fields for all users (including printer users)
//   addressLine1?: string;
//   addressLine2?: string;
//   state?: string;
//   district?: string;
//   pincode?: string;
//   // Plant location specifically for printer users
//   plantLocation?: string;
//   companyName?: string;
//   bankName?: string;
//   accountHolderName?: string;
//   bankAccount?: string;
//   ifsc?: string;
//   status?: 'Active' | 'Pending' | 'Inactive';
// }

interface UserManagementProps {
  language?: 'en' | 'hi';
}

export function UserManagement({ language = 'en' }: UserManagementProps) {
  // Translation object
  const translations = {
    en: {
      userManagement: 'User Management',
      manageUsersDesc: 'Manage users, roles, and permissions',
      addUser: 'Add User',
      searchUsers: 'Search users...',
      allRoles: 'All Roles',
      allStatus: 'All Status',
      user: 'User',
      role: 'Role',
      location: 'Location',
      status: 'Status',
      created: 'Created',
      actions: 'Actions',
      addNewUser: 'Add New User',
      updateUser: 'Update User',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      mobile: 'Mobile',
      bankDetails: 'Bank details',
      bankName: 'Bank Name',
      accountHolderName: 'Account Holder Name',
      bankAccountNumber: 'Bank Account Number',
      ifscCode: 'IFSC Code',
      cancel: 'Cancel',
      saveUser: 'Save User',
      updateUserBtn: 'Update User',
      deleteUser: 'Delete User',
      confirmDelete: 'Are you sure you want to delete this user?',
      confirmDeleteDesc: 'This action cannot be undone.',
      nameEmailRequired: 'Name and Email are required',
      userAddedSuccess: 'User added successfully!',
      userUpdatedSuccess: 'User updated successfully!',
      userDeletedSuccess: 'User deleted successfully!',
      loading: 'Loading...',
      noUsers: 'No users found',
      refreshUsers: 'Refresh Users',
      // Pagination
      showingEntries: 'Showing',
      to: 'to',
      of: 'of',
      entries: 'entries',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      rowsPerPage: 'Rows per page:',
      roles: {
        Admin: 'Admin',
        Finance: 'Finance',
        'Zonal Head': 'Zonal Head',
        'State Head': 'State Head',
        PrinterUser: 'PrinterUser'
      },
      statuses: {
        Active: 'Active',
        Pending: 'Pending',
        Inactive: 'Inactive'
      }
    },
    hi: {
      userManagement: 'उपयोगकर्ता प्रबंधन',
      manageUsersDesc: 'उपयोगकर्ताओं, भूमिकाओं और अनुमतियों का प्रबंधन करें',
      addUser: 'उपयोगकर्ता जोड़ें',
      searchUsers: 'उपयोगकर्ता खोजें...',
      allRoles: 'सभी भूमिकाएं',
      allStatus: 'सभी स्थितियां',
      user: 'उपयोगकर्ता',
      role: 'भूमिका',
      location: 'स्थान',
      status: 'स्थिति',
      created: 'बनाया गया',
      actions: 'कार्य',
      addNewUser: 'नया उपयोगकर्ता जोड़ें',
      updateUser: 'उपयोगकर्ता अपडेट करें',
      name: 'नाम',
      email: 'ईमेल',
      password: 'पासवर्ड',
      mobile: 'मोबाइल',
      bankDetails: 'बैंक विवरण',
      bankName: 'बैंक का नाम',
      accountHolderName: 'खाता धारक का नाम',
      bankAccountNumber: 'बैंक खाता संख्या',
      ifscCode: 'आईएफएससी कोड',
      cancel: 'रद्द करें',
      saveUser: 'उपयोगकर्ता सहेजें',
      updateUserBtn: 'उपयोगकर्ता अपडेट करें',
      deleteUser: 'उपयोगकर्ता हटाएं',
      confirmDelete: 'क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?',
      confirmDeleteDesc: 'यह कार्य पूर्ववत नहीं किया जा सकता।',
      nameEmailRequired: 'नाम और ईमेल आवश्यक हैं',
      userAddedSuccess: 'उपयोगकर्ता सफलतापूर्वक जोड़ा गया!',
      userUpdatedSuccess: 'उपयोगकर्ता सफलतापूर्वक अपडेट किया गया!',
      userDeletedSuccess: 'उपयोगकर्ता सफलतापूर्वक हटाया गया!',
      loading: 'लोड हो रहा है...',
      noUsers: 'कोई उपयोगकर्ता नहीं मिला',
      refreshUsers: 'उपयोगकर्ता रीफ्रेश करें',
      // Pagination
      showingEntries: 'दिखा रहे हैं',
      to: 'से',
      of: 'का',
      entries: 'प्रविष्टियां',
      previous: 'पिछला',
      next: 'अगला',
      page: 'पृष्ठ',
      rowsPerPage: 'प्रति पृष्ठ पंक्तियां:',
      roles: {
        Admin: 'व्यवस्थापक',
        Finance: 'वित्त',
        'Zonal Head': 'क्षेत्रीय प्रमुख',
        'State Head': 'राज्य प्रमुख',
        PrinterUser: '프린터 사용자'
      },
      statuses: {
        Active: 'सक्रिय',
        Pending: 'लंबित',
        Inactive: 'निष्क्रिय'
      }
    }
  };
  
  const t = translations[language];
  
  // Use the enhanced API hook with error handling
  const { 
    users, 
    isLoading: usersLoading, 
    error: usersError,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    addUserToList,
    updateUserInList,
    removeUserFromList 
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<FormUserRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'Admin',
    addressLine1: '',
    addressLine2: '',
    state: '',
    district: '',
    pincode: '',
    plantLocation: '',
    companyName: '',
    bankName: '',
    accountHolderName: '',
    bankAccount: '',
    ifsc: '',
    status: 'Pending'
  });

  // Filter users based on search and filters - UPDATED WITH EXCLUSION LOGIC
  const filteredUsers = users.filter(user => {
    // Exclude specific roles that shouldn't appear in the user management list
    const excludedRoles = ['msr', 'mechanic', 'dealer', 'stockist'];
    if (excludedRoles.includes(user.role.toLowerCase())) {
      return false;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (user.name || '').toLowerCase().includes(searchLower) ||
                         (user.email || '').toLowerCase().includes(searchLower) ||
                         (user.mobile || '').toLowerCase().includes(searchLower);
    
    const userDisplayRole = mapToDisplayRole(user.role);
    const matchesRole = selectedRole === 'all' || userDisplayRole === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const { createUser: legacyCreateUser, isLoading: createLoading } = useCreateUser();

  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      mobile: '',
      role: 'Admin',
      addressLine1: '',
      addressLine2: '',
      state: '',
      district: '',
      pincode: '',
      plantLocation: '',
      companyName: '',
      bankName: '',
      accountHolderName: '',
      bankAccount: '',
      ifsc: '',
      status: 'Pending'
    });
  };

  // CLEAN handleAddUser with hook-based error handling
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error(t.nameEmailRequired);
      return;
    }

    if (!validateEmail(newUser.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const isPrinterUser = newUser.role === 'PrinterUser';
      
      // Prepare the payload with all required fields
      const userPayload: any = {
        name: newUser.name.trim(),
        role: mapToApiRole(newUser.role),
        email: newUser.email.trim(),
        mobile: newUser.mobile?.trim() || '',
        password: newUser.password || '',
        reports_to: 1,
        address_line1: newUser.addressLine1?.trim() || '',
        address_line2: newUser.addressLine2?.trim() || '',
        state: newUser.state?.trim() || '',
        district: newUser.district?.trim() || '',
        pincode: newUser.pincode?.trim() || '',
      };

      // Handle location field properly
      if (isPrinterUser && newUser.plantLocation) {
        // Send only the plant number to the API (01, 02, etc.)
        userPayload.location = newUser.plantLocation;  // Just "01", not "Plant 01"
      } else {
        const locationParts = [
          newUser.district?.trim(),
          newUser.state?.trim()
        ].filter(Boolean);
        userPayload.location = locationParts.length > 0 ? locationParts.join(', ') : '';
      }


      // Add bank details for specific roles
      if (newUser.role === 'Zonal Head' || newUser.role === 'State Head') {
        userPayload.bank_account_holder = newUser.accountHolderName?.trim() || '';
        userPayload.bank_name = newUser.bankName?.trim() || '';
        userPayload.bank_account_number = newUser.bankAccount?.trim() || '';
        userPayload.bank_ifsc_code = newUser.ifsc?.trim() || '';
      }

      if (newUser.companyName?.trim()) {
        userPayload.company_name = newUser.companyName.trim();
      }

      console.log('Final payload being sent:', JSON.stringify(userPayload, null, 2));

      // Use the hook's createUser method (which handles errors automatically)
      const response = await createUser(userPayload);
        
      // Create proper location strings
      let addressLocation = '';
      let plantLoc = '';

      if (isPrinterUser) {
        // For printer users, store plant location separately
        plantLoc = newUser.plantLocation || '';
        // Also build address location from address fields
        const addressParts = [
          newUser.addressLine1?.trim(),
          newUser.addressLine2?.trim(),
          newUser.district?.trim(),
          newUser.state?.trim(),
          newUser.pincode?.trim()
        ].filter(Boolean);
        addressLocation = addressParts.length > 0 ? addressParts.join(', ') : '';
      } else {
        // For non-printer users, build location from address fields
        const locationParts = [
          newUser.addressLine1?.trim(),
          newUser.addressLine2?.trim(),
          newUser.district?.trim(),
          newUser.state?.trim(),
          newUser.pincode?.trim()
        ].filter(Boolean);
        addressLocation = locationParts.length > 0 ? locationParts.join(', ') : '';
      }

      // Add the new user to the local list with separated locations
      const newEntry: User = {
        id: response.user_id.toString(),
        name: response.name,
        email: response.email || '',
        role: response.role,
        location: addressLocation || undefined, // Address-based location
        plantLocation: plantLoc || undefined,   // Plant location for printers
        mobile: response.mobile || '',
        // Address fields
        addressLine1: response.address_line1 || undefined,
        addressLine2: response.address_line2 || undefined,
        state: response.state || undefined,
        district: response.district || undefined,
        pincode: response.pincode || undefined,
        latitude: response.latitude || undefined,
        longitude: response.longitude || undefined,
        // Company/Bank fields
        companyName: response.company_name || undefined,
        bankAccount: response.bank_account_number || undefined,
        bankName: response.bank_name || undefined,
        accountHolderName: response.bank_account_holder || undefined,
        ifsc: response.bank_ifsc_code || undefined,
        // Additional fields
        tNo: response.t_no || undefined,
        designation: response.designation || undefined,
        hq: response.hq || undefined,
        responsibility: response.responsibility || undefined,
        reportsTo: response.reports_to || undefined,
        status: response.status ? 'Active' : 'Inactive',
        createdAt: new Date(response.created_at).toISOString().split('T')[0]
      };

      addUserToList(newEntry);
      setShowCreateForm(false);
      resetForm();
      toast.success(t.userAddedSuccess);
      fetchUsers();
    } catch (error) {
      // Error is already handled by the hook with toast message
      return;
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      removeUserFromList(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      toast.success(t.userDeletedSuccess);
    } catch (error) {
      // Error is already handled by the hook
      return;
    }
  };

  // CLEAN handleUpdateUser with hook-based error handling
  const handleUpdateUser = async () => {
    if (!newUser.name || !newUser.email || !selectedUser) {
      toast.error(t.nameEmailRequired);
      return;
    }

    if (!validateEmail(newUser.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const isPrinterUser = selectedUser.role === 'printer';
      
      // Prepare the update payload with proper field trimming
      const userPayload: any = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        mobile: newUser.mobile?.trim() || '',
        address_line1: newUser.addressLine1?.trim() || '',
        address_line2: newUser.addressLine2?.trim() || '',
        state: newUser.state?.trim() || '',
        district: newUser.district?.trim() || '',
        pincode: newUser.pincode?.trim() || '',
      };

      // Handle location field properly for updates
      if (isPrinterUser && newUser.plantLocation) {
        userPayload.location = `Plant ${newUser.plantLocation}`;
      } else {
        const locationParts = [
          newUser.district?.trim(),
          newUser.state?.trim()
        ].filter(Boolean);
        userPayload.location = locationParts.length > 0 ? locationParts.join(', ') : '';
      }

      // Add bank details for specific roles
      if (selectedUser.role === 'zonalhead' || selectedUser.role === 'statehead') {
        userPayload.bank_account_holder = newUser.accountHolderName?.trim() || '';
        userPayload.bank_name = newUser.bankName?.trim() || '';
        userPayload.bank_account_number = newUser.bankAccount?.trim() || '';
        userPayload.bank_ifsc_code = newUser.ifsc?.trim() || '';
      }

      if (newUser.companyName?.trim()) {
        userPayload.company_name = newUser.companyName.trim();
      }

      // Only include password if it's being changed
      if (newUser.password?.trim()) {
        userPayload.password = newUser.password.trim();
      }

      console.log('Update payload being sent:', JSON.stringify(userPayload, null, 2));

      // Use the hook's updateUser method
      const response = await updateUser(selectedUser.id, userPayload);
      
      // Create location string based on user type
      // Create proper location strings
      let addressLocation = '';
      let plantLoc = '';

      if (isPrinterUser) {
        // For printer users, store plant location separately
        plantLoc = newUser.plantLocation || '';
        // Also build address location from address fields
        const addressParts = [
          newUser.addressLine1?.trim(),
          newUser.addressLine2?.trim(),
          newUser.district?.trim(),
          newUser.state?.trim(),
          newUser.pincode?.trim()
        ].filter(Boolean);
        addressLocation = addressParts.length > 0 ? addressParts.join(', ') : '';
      } else {
        // For non-printer users, build location from address fields
        const locationParts = [
          newUser.addressLine1?.trim(),
          newUser.addressLine2?.trim(),
          newUser.district?.trim(),
          newUser.state?.trim(),
          newUser.pincode?.trim()
        ].filter(Boolean);
        addressLocation = locationParts.length > 0 ? locationParts.join(', ') : '';
      }

      // Update local state with separated locations
      const updatedUser: User = {
        id: response.user_id.toString(),
        name: response.name,
        email: response.email || '',
        role: response.role,
        location: addressLocation || undefined, // Address-based location
        plantLocation: plantLoc || undefined,   // Plant location for printers
        mobile: response.mobile || '',
        // Address fields
        addressLine1: response.address_line1 || undefined,
        addressLine2: response.address_line2 || undefined,
        state: response.state || undefined,
        district: response.district || undefined,
        pincode: response.pincode || undefined,
        latitude: response.latitude || undefined,
        longitude: response.longitude || undefined,
        // Company/Bank fields
        companyName: response.company_name || undefined,
        bankAccount: response.bank_account_number || undefined,
        bankName: response.bank_name || undefined,
        accountHolderName: response.bank_account_holder || undefined,
        ifsc: response.bank_ifsc_code || undefined,
        // Additional fields
        tNo: response.t_no || undefined,
        designation: response.designation || undefined,
        hq: response.hq || undefined,
        responsibility: response.responsibility || undefined,
        reportsTo: response.reports_to || undefined,
        status: response.status ? 'Active' : 'Inactive',
        createdAt: new Date(response.created_at).toISOString().split('T')[0]
      };

      updateUserInList(updatedUser);
      setShowUpdateForm(false);
      setSelectedUser(null);
      resetForm();
      toast.success(t.userUpdatedSuccess);
    } catch (error) {
      // Error is already handled by the hook
      return;
    }
  };

  const openUpdateForm = (user: User) => {
    setSelectedUser(user);
    const displayRole = mapToDisplayRole(user.role) as FormUserRole;
    
    // Check if user is a printer user
    const isPrinterUser = user.role === 'printer';
    
    // Use the address fields from the User object directly
    setNewUser({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      mobile: user.mobile || '',
      role: displayRole,
      addressLine1: user.addressLine1 || '',
      addressLine2: user.addressLine2 || '',
      state: user.state || '',
      district: user.district || '',
      pincode: user.pincode || '',
      plantLocation: isPrinterUser && user.location && user.location.startsWith('Plant ') 
        ? user.location.replace('Plant ', '') 
        : '',
      companyName: user.companyName || '',
      bankName: user.bankName || '',
      accountHolderName: user.accountHolderName || '',
      bankAccount: user.bankAccount || '',
      ifsc: user.ifsc || '',
      status: user.status as 'Active' | 'Pending' | 'Inactive'
    });
    setShowUpdateForm(true);
  };

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      Pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      Inactive: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {t.statuses[status as keyof typeof t.statuses] || status}
      </span>
    );
  };

  const handleRoleChange = (role: string) => {
    setNewUser({ ...newUser, role: role as FormUserRole });
  };

  // Handle refresh users
  const handleRefreshUsers = () => {
    fetchUsers();
  };

  // Effect to reset pagination when filters change
  React.useEffect(() => {
    handleFiltersChange();
  }, [searchTerm, selectedRole, selectedStatus]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.userManagement}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t.manageUsersDesc}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefreshUsers}
              disabled={usersLoading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <span>{usersLoading ? t.loading : t.refreshUsers}</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{t.addUser}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State - Fixed */}
      {usersError && (
        <div className="flex-shrink-0 mx-4 mt-2">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-300">Error: {usersError}</p>
            <button 
              onClick={handleRefreshUsers}
              className="mt-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Filters Section - Fixed */}
      <div className="flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-900">
        <Filters
          searchTerm={searchTerm}
          selectedRole={selectedRole}
          selectedStatus={selectedStatus}
          itemsPerPage={itemsPerPage}
          t={t}
          onSearchChange={setSearchTerm}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Table Container - Flexible */}
      <div className="flex-1 mx-4 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
        {usersLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t.noUsers}</p>
              <button 
                onClick={handleRefreshUsers}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {t.refreshUsers}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <UserTable
                users={filteredUsers}
                currentUsers={currentUsers}
                t={t}
                getStatusBadge={getStatusBadge}
                openUpdateForm={openUpdateForm}
                openDeleteConfirm={openDeleteConfirm}
              />
            </div>

            {/* Pagination - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
                itemsPerPage={itemsPerPage}
                t={t}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Add User Modal */}
      <UserForm
        isOpen={showCreateForm}
        userData={newUser}
        t={t}
        isLoading={createLoading}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleAddUser}
        onUserDataChange={setNewUser}
      />

      {/* Update User Modal */}
      <UserForm
        isOpen={showUpdateForm}
        isUpdate={true}
        userData={newUser}
        t={t}
        isLoading={createLoading}
        onClose={() => setShowUpdateForm(false)}
        onSubmit={handleUpdateUser}
        onUserDataChange={setNewUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        user={selectedUser}
        t={t}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}