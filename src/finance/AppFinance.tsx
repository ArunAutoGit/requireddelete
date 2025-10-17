import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from './components/Layout/Layout';
import { Toaster } from 'react-hot-toast';
import Dashboard from '../shared/components/Heatmap/Dashboard';
import Reports from './components/Reports/Reports';

// Type definitions (move to separate types file if needed)
interface HeatmapData {
  dateRange: { start: string; end: string };
  maxScanCount: number;
  areas: Array<{
    id: string;
    name: string;
    scanCount: number;
    type: string;
  }>;
}

interface FilterState {
  geographicalScope: string;
  timeScope: string;
  customDateRange: { start: string; end: string };
}

// Main App Component
function AppFinance() {
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
          {/* Main Routes */}
          <Route index element={<Dashboard language={language} />} />
          <Route path="reports" element={<Reports language={language} />} />
        </Route>
        
        {/* Fallback route - redirects any unknown paths to main finance page */}
        <Route path="*" element={<Navigate to="/finance" replace />} />
      </Routes>
      
      {/* Global toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export default AppFinance;
