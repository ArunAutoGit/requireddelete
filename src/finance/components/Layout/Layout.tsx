import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LayoutProps } from '../../../admin/types/components';


export const Layout: React.FC<LayoutProps> = ({ language, onLanguageToggle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleMobileMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Fixed Sidebar - Full Height */}
      <div className="flex-shrink-0">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
          language={language}
          isCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Content Area - Header + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header - Only spans main content area */}
        <div className="flex-shrink-0">
          <Header 
            onMenuClick={handleMobileMenuClick}
            language={language}
            onLanguageToggle={onLanguageToggle}
            onSidebarToggle={handleSidebarToggle}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet context={{ language }} />
        </main>
      </div>
    </div>
  );
};
