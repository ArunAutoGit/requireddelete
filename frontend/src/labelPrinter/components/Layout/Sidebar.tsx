import React, { useState, useRef } from 'react';
import { 
  Home, 
  Tags, 
  Eye, 
  FileText, 
  LogOut,
  X,
  Layers
} from 'lucide-react';
import tvsLogo from '../../../logo/tvs_sbl.png'; // Adjust path as needed
import { SidebarProps } from '../../../admin/types/components';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   language?: 'en' | 'hi';
//   isCollapsed?: boolean;
//   isDark?: boolean;
//   activeTab: string;
//   onTabChange: (tab: string) => void;
//   onLogout: () => void;
//   user?: { name?: string; role?: string };
// }

const labels = {
  en: {
    companyName: "TVS SBL",
    dashboard: "Dashboard",
    generation: "Label Generation",
    batchdashboard: "Batches",
    preview: "Print Preview",
    reports: "Reports",
    logout: "Logout"
  },
  hi: {
    companyName: "टीवीएस एसबीएल",
    dashboard: "डैशबोर्ड",
    generation: "लेबल जेनरेशन",
    batchdashboard: "बैच",
    preview: "प्रिंट प्रीव्यू",
    reports: "रिपोर्ट्स",
    logout: "लॉग आउट"
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  language = 'en',
  isCollapsed = false,
  isDark = false,
  activeTab,
  onTabChange,
  onLogout,
  user
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const text = labels[language];

  const navigation = [
    { name: text.dashboard, href: 'dashboard', icon: Home },
    { name: text.generation, href: 'generation', icon: Tags },
    { name: text.batchdashboard, href: 'batchdashboard', icon: Layers },
    { name: text.preview, href: 'preview', icon: Eye },
    { name: text.reports, href: 'reports', icon: FileText },
  ];

  const handleMouseEnter = (itemName: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsed) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top + rect.height / 2
      });
      setHoveredItem(itemName);
    }
  };

  const handleMouseLeave = () => setHoveredItem(null);

  const handleNavClick = (href: string) => {
    onTabChange(href);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const renderTooltip = () => {
    if (!isCollapsed || !hoveredItem) return null;

    const getTooltipText = () => {
      if (hoveredItem === 'logo') {
        return text.companyName;
      }
      if (hoveredItem === 'logout') {
        return text.logout;
      }
      return hoveredItem;
    };

    return (
      <div 
        className="fixed bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z-[100] pointer-events-none"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translateY(-50%)'
        }}
      >
        {getTooltipText()}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        border-r transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-full flex flex-col
      `}>
        <div className="flex flex-col h-full">
          {/* Header with TVS SBL Logo and Company Name - FIXED HEIGHT */}
          <div className={`flex-shrink-0 flex items-center justify-between p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div className="flex items-center space-x-3 flex-1">
              {/* TVS SBL Logo and Company Name - Expanded View */}
              {!isCollapsed && (
                <div className="flex items-center space-x-4 flex-1">
                  <img 
                    src={tvsLogo} 
                    alt="TVS SBL Logo" 
                    className="w-12 h-12 object-contain flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0066cc]'}`}>
                      {text.companyName}
                    </h2>
                  </div>
                </div>
              )}
              
              {/* TVS SBL Logo Only - Collapsed View */}
              {isCollapsed && (
                <div 
                  className="flex items-center justify-center w-full"
                  onMouseEnter={(e) => handleMouseEnter('logo', e)}
                  onMouseLeave={handleMouseLeave}
                  ref={(el) => itemRefs.current['logo'] = el}
                >
                  <img 
                    src={tvsLogo} 
                    alt="TVS SBL Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className={`lg:hidden p-1 rounded-md transition-colors flex-shrink-0 ${
                isDark ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-100 text-gray-500'
              }`}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation - TAKES REMAINING SPACE */}
          <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.href;
              
              return (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={(e) => handleMouseEnter(item.name, e)}
                  onMouseLeave={handleMouseLeave}
                  ref={(el) => itemRefs.current[item.name] = el}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`
                      flex items-center ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'} 
                      rounded-lg text-sm font-medium transition-colors relative w-full
                      ${isActive
                        ? 'bg-[#0066cc] text-white' 
                        : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Logout Button - FOOTER (FIXED HEIGHT) */}
          <div className={`flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'} ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t`}>
            <div 
              className="relative"
              onMouseEnter={(e) => handleMouseEnter('logout', e)}
              onMouseLeave={handleMouseLeave}
              ref={(el) => itemRefs.current['logout'] = el}
            >
              <button
                onClick={onLogout}
                className={`
                  flex items-center ${isCollapsed ? 'justify-center p-3 w-full' : 'w-full px-3 py-2'} 
                  rounded-lg text-sm font-medium transition-colors
                  ${isDark 
                    ? 'text-red-400 hover:bg-red-900/20' 
                    : 'text-red-600 hover:bg-red-50'
                  }
                `}
              >
                <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!isCollapsed && <span>{text.logout}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip for collapsed mode */}
      {renderTooltip()}
    </>
  );
};
