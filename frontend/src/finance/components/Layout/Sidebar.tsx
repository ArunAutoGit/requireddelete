import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import tvsLogo from '../../../logo/tvs_sbl.png';
import { SidebarProps } from '../../../admin/types/components';



const labels = {
  en: {
    dashboard: "Dashboard",
    reports: "Reports",
    logout: "Logout",
    companyName: "TVS SBL"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    reports: "रिपोर्ट्स",
    logout: "लॉग आउट",
    companyName: "टीवीएस एसबीएल"
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  language = 'en',
  isCollapsed = false
}) => {
  const { logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const text = labels[language];

  const navigation = [
    { name: text.dashboard, href: '/finance', icon: LayoutDashboard },
    { name: text.reports, href: '/finance/reports', icon: FileText },
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

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // FIXED: Render tooltip for collapsed mode
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
        bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-full flex flex-col
      `}>
        {/* FIXED: Added h-full to ensure proper flexbox behavior */}
        <div className="flex flex-col h-full">
          {/* Header with Logo and Company Name - FIXED HEIGHT */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 flex-1">
              {/* Logo and Company Name - Expanded View */}
              {!isCollapsed && (
                <div className="flex items-center space-x-4 flex-1">
                  <img 
                    src={tvsLogo} 
                    alt="TVS SBL Logo" 
                    className="w-12 h-12 object-contain flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#0066cc]">
                      {text.companyName}
                    </h2>
                  </div>
                </div>
              )}
              
              {/* Logo Only - Collapsed View */}
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
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation - TAKES REMAINING SPACE */}
          <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              
              return (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={(e) => handleMouseEnter(item.name, e)}
                  onMouseLeave={handleMouseLeave}
                  ref={(el) => itemRefs.current[item.name] = el}
                >
                  <NavLink
                    to={item.href}
                    end={item.href === '/finance'}
                    className={({ isActive }) => `
                      flex items-center ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'} 
                      rounded-lg text-sm font-medium transition-colors relative
                      ${isActive ? 'bg-[#0066cc] text-white' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                    onClick={handleNavClick}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                </div>
              );
            })}
          </nav>

          {/* Logout Button - FOOTER (FIXED HEIGHT) */}
          <div className={`flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200`}>
            <div 
              className="relative"
              onMouseEnter={(e) => handleMouseEnter('logout', e)}
              onMouseLeave={handleMouseLeave}
              ref={(el) => itemRefs.current['logout'] = el}
            >
              <button
                onClick={handleLogout}
                className={`
                  flex items-center ${isCollapsed ? 'justify-center p-3 w-full' : 'w-full px-3 py-2'} 
                  rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors
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
