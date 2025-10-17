import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from './components/Layout/Layout';
import { Toaster } from 'react-hot-toast';

// Import shared components
import HeatmapDashboard from '../shared/components/Heatmap/Dashboard';
import Reports from '../finance/components/Reports/Reports';

import { AssetAllocation } from './components/AssetAllocation/components/AssetAllocation';
// Import admin-specific components
import Dashboard from './components/Dashboard/Dashboard';
import { ProductMaster } from './components/ProductMaster/ProductMaster';
import { QueryManagement } from './components/QueryManagement/QueryManagement';
import { UserManagement } from './components/UserManagement/UserManagement';
import  MSRApproval  from './components/MsrApproval/MsrApproval';
// Import the actual MSRVisits component (renamed to avoid conflict)
import MSRVisit from './components/MsrVisit/MSRVisit';

// Placeholder components for admin-specific features
const AccessManagement = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Management</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Role Hierarchy</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-3 py-1 rounded-full">Admin</span>
          <span>→</span>
          <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">Finance</span>
          <span>→</span>
          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">Zonal Head</span>
          <span>→</span>
          <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">State Head</span>
          <span>→</span>
          <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full">MSR</span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400">Manage role assignments and permissions here.</p>
    </div>
  </div>
);

function AppAdmin() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route
          path="/"
          element={<Layout language={language} onLanguageToggle={handleLanguageToggle} />}
        >

          {/* Main admin dashboard - Use your existing Dashboard component */}
          <Route index element={<Dashboard language={language} />} />
          
          {/* Heatmap-specific route - ONLY heatmap component */}
          <Route path="heatmap" element={
            <HeatmapDashboard language={language} />
          } />
          
          {/* Shared reports */}
          <Route path="reports" element={<Reports language={language} />} />
          
          {/* Admin-specific routes */}
          <Route path="users" element={<UserManagement language={language} />} />
          <Route path="access" element={<AccessManagement />} />
          <Route path="assets" element={<AssetAllocation language={language} />} />
          <Route path="products" element={<ProductMaster language={language} />} />
          <Route path="queries" element={<QueryManagement language={language} />} />
          {/* Updated route to use the actual MSRVisitTracker component */}
          <Route path="visits" element={<MSRVisit />} />
          <Route path="msr-approval" element={<MSRApproval language={language} />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default AppAdmin;