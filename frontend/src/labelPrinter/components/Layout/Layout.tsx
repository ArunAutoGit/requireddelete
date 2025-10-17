import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LayoutProps } from '../../../admin/types/components';

// interface LayoutProps {
//   language?: 'en' | 'hi';
//   onLanguageToggle?: () => void;
// }

export const Layout: React.FC<LayoutProps> = ({ 
  language = 'en', 
  onLanguageToggle = () => {} 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleMobileMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleLanguageToggle = () => {
    if (onLanguageToggle) {
      onLanguageToggle();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const user = {
    name: 'MSR User',
    role: 'Administrator'
  };

  const getTitle = () => {
    const titles: Record<string, { en: string; hi: string }> = {
      dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
      generation: { en: 'Label Generation', hi: 'लेबल जेनरेशन' },
      batchdashboard: { en: 'Batches', hi: 'बैच' },
      preview: { en: 'Print Preview', hi: 'प्रिंट प्रीव्यू' },
      reports: { en: 'Reports', hi: 'रिपोर्ट्स' },
      settings: { en: 'Settings', hi: 'सेटिंग्स' },
    };
    
    return titles[activeTab]?.[language] || titles.dashboard[language];
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Fixed Sidebar - Full Height */}
      <div className="flex-shrink-0">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
          language={language}
          isCollapsed={sidebarCollapsed}
          isDark={isDark}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          user={user}
        />
      </div>

      {/* Main Content Area - Header + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header - Only spans main content area */}
        <div className="flex-shrink-0">
          <Header 
            onMenuClick={handleMobileMenuClick}
            language={language}
            onLanguageToggle={handleLanguageToggle}
            onSidebarToggle={handleSidebarToggle}
            title={getTitle()}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            user={user}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
          <Outlet context={{ language, activeTab }} />
        </main>
      </div>
    </div>
  );
};
