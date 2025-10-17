import React from 'react';
import { Menu, Globe } from 'lucide-react';
import { HeaderProps } from '../../../admin/types/components';

// interface HeaderProps {
//   language: 'en' | 'hi';
//   onMenuClick: () => void;
//   onLanguageToggle: () => void;
//   onSidebarToggle: () => void;
//   title: string;
//   isDark: boolean;
//   onThemeToggle: () => void;
//   user?: { name?: string; role?: string };
// }

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  language, 
  onLanguageToggle,
  onSidebarToggle,
  title,
  isDark,
  onThemeToggle,
  user
}) => {
  return (
    <header className={`flex-shrink-0 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile hamburger menu */}
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={onSidebarToggle}
            className={`hidden lg:block p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Title */}
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#0066cc]'}`}>
              {title}
            </h1>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' ? 'Label Printer Web Application' : 'लेबल प्रिंटर वेब एप्लिकेशन'}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
              isDark 
                ? 'hover:bg-gray-800 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-gray-200 hover:border-[#0066cc]'
            }`}
            title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {language === 'hi' ? 'हिं' : 'EN'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
