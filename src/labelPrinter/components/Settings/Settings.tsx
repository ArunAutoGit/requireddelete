import React from 'react';
import { Sun, Moon, Printer, User, Wifi, Database, Download } from 'lucide-react';
import { SettingsProps } from '../../../admin/types/components';

// interface SettingsProps {
//   isDark: boolean;
//   onThemeToggle: () => void;
//   language: 'en' | 'hi';
//   onLanguageToggle: () => void;
// }

export default function Settings({ isDark, onThemeToggle }: SettingsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure your application preferences
        </p>
      </div>

      {/* Theme Settings */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Appearance
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Theme
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current: {isDark ? 'Dark' : 'Light'} theme
                </div>
              </div>
            </div>
            
            <button
              onClick={onThemeToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                  ${isDark ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* User Settings */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          User Profile
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                MSR User
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Market Sales Representative
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printer Settings */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Printer Configuration
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-blue-600" />
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Default Printer
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  HP LaserJet Pro M404n
                </div>
              </div>
            </div>
            
            <button className={`
              px-3 py-2 border rounded-lg transition-colors duration-200
              ${isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }
            `}>
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Label Size
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  50mm x 30mm (2" x 1.2")
                </div>
              </div>
            </div>
            
            <button className={`
              px-3 py-2 border rounded-lg transition-colors duration-200
              ${isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }
            `}>
              Change
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          System Status
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-green-600" />
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Connection Status
                </div>
                <div className="text-sm text-green-600">
                  Connected to server
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Database Sync
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last synced: 2 minutes ago
                </div>
              </div>
            </div>
            
            <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Export All Data
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Download complete database backup
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}