import React from 'react';
import { Menu, Globe } from 'lucide-react';
import { HeaderProps } from '../../../admin/types/components';

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  language, 
  onLanguageToggle,
  onSidebarToggle 
}) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile hamburger menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Desktop sidebar toggle */}
          {onSidebarToggle && (
            <button
              onClick={onSidebarToggle}
              className="hidden lg:block p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          {/* Clean Professional Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#0066cc]">
              {language === 'en' ? 'Finance Panel' : 'वित्त पैनल'}
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              {language === 'en' ? 'TVS SBL Management System' : 'टीवीएस एसबीएल प्रबंधन सिस्टम'}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={onLanguageToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 border border-gray-200 hover:border-[#0066cc]"
          title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
        >
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            {language === 'hi' ? 'हिं' : 'EN'}
          </span>
        </button>
      </div>
    </header>
  );
};
