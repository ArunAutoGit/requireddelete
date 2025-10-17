import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle,
  Shield, 
  Monitor, 
  Package, 
  FileText, 
  MapPin,
  BarChart3,  // Add this import for heatmap
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import tvsLogo from '../../../logo/tvs_sbl.png';
import { SidebarProps } from '../../types/components';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   language?: 'en' | 'hi';
//   isCollapsed?: boolean;
// }

const labels = {
  en: {
    companyName: "TVS SBL",
    dashboard: "Dashboard",
    heatmap: "Heatmap",  // Add this label
    userManagement: "User Management",
    msrApproval: "MSR Approval", 
    assetAllocation: "Asset Allocation",
    productMaster: "Product Master",
    reports: "Reports",
    msrVisits: "MSR Visits",
    logout: "Logout",
    role: "Role",
    user: "User"
  },
  hi: {
    companyName: "टीवीएस एसबीएल",
    dashboard: "डैशबोर्ड",
    heatmap: "हीटमैप",  // Add this Hindi label
    userManagement: "उपयोगकर्ता प्रबंधन",
    msrApproval: "एमएसआर अनुमोदन",
    assetAllocation: "संपत्ति आवंटन",
    productMaster: "उत्पाद मास्टर",
    reports: "रिपोर्ट्स",
    msrVisits: "एमएसआर विज़िट",
    logout: "लॉग आउट",
    role: "भूमिका",
    user: "उपयोगकर्ता"
  }
};

export function Sidebar({ isOpen, onClose, language = 'en', isCollapsed = false }: SidebarProps) {
  const { logout, user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const text = labels[language];

  const navigation = [
    { name: text.dashboard, href: '/admin', icon: LayoutDashboard },
    { name: text.heatmap, href: '/admin/heatmap', icon: BarChart3 },  // Add this line
    { name: text.userManagement, href: '/admin/users', icon: Users },
    { name: text.msrApproval, href: '/admin/msr-approval', icon: CheckCircle },
    { name: text.assetAllocation, href: '/admin/assets', icon: Monitor },
    { name: text.productMaster, href: '/admin/products', icon: Package },
    { name: text.reports, href: '/admin/reports', icon: FileText },
    { name: text.msrVisits, href: '/admin/visits', icon: MapPin },
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

  // Render tooltip for collapsed mode
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
        className="fixed bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z- pointer-events-none"
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
        <div className="flex flex-col h-full">
          {/* Header with Logo and Company Name - FIXED HEIGHT */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 flex-1">
              {/* Logo and Company Name - Expanded View */}
              {!isCollapsed && (
                <div className="flex items-center space-x-3 flex-1">
                  <img 
                    src={tvsLogo} 
                    alt="TVS SBL Logo" 
                    className="w-10 h-10 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[#0066cc] truncate">
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
                    className="w-8 h-8 object-contain"
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
                    end={item.href === '/admin'}
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
}
