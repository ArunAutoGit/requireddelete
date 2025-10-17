import { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import LabelGeneration from './components/LabelGeneration/LabelGeneration';
import PrintPreview from './components/PrintPreview/PrintPreview';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import BatchDashboard from './components/BatchDashboard/BatchDashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { useAuth } from '../contexts/AuthContext';

function AppPrint() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [printData, setPrintData] = useState<any>(null);
  const { logout } = useAuth();

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleMobileMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Enhanced tab change handler to handle data passing
  const handleTabChange = (tab: string, data?: any) => {
    if (data) {
      setPrintData(data);
    }
    setActiveTab(tab);
  };

  const user = {
    name: 'MSR User',
    role: 'Administrator'
  };

  const getPageTitle = () => {
    const titles = {
      en: {
        dashboard: 'Dashboard',
        generation: 'Label Generation',
        preview: 'Print Preview',
        reports: 'Reports',
        settings: 'Settings',
        batchdashboard: 'Batch Dashboard',
      },
      hi: {
        dashboard: 'डैशबोर्ड',
        generation: 'लेबल जेनरेशन',
        preview: 'प्रिंट प्रीव्यू',
        reports: 'रिपोर्ट्स',
        settings: 'सेटिंग्स',
        batchdashboard: 'बैच डैशबोर्ड',
      },
    };
    
    return titles[language][activeTab as keyof typeof titles[typeof language]] || titles[language].dashboard;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isDark={isDark} onTabChange={handleTabChange} language={language} />;
      case 'generation':
        return (
          <LabelGeneration 
            isDark={isDark} 
            onTabChange={handleTabChange}
            language={language} 
          />
        );
      case 'preview':
        return <PrintPreview isDark={isDark} onTabChange={handleTabChange} language={language} printData={printData} />;
      case 'reports':
        return <Reports isDark={isDark} language={language} />;
      case 'settings':
        return (
          <PrintPreview 
            isDark={isDark} 
            onTabChange={handleTabChange} 
            language={language}
            printData={printData}
          />
        );
      case 'batchdashboard':
        return <BatchDashboard isDark={isDark} language={language} onTabChange={handleTabChange} />;
      default:
        return <Dashboard isDark={isDark} onTabChange={handleTabChange} language={language} />;
    }
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
          onLogout={logout}
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
            title={getPageTitle()}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            user={user}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AppPrint;
