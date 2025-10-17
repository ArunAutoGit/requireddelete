import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatsCardProps } from '../../types/components';

// interface StatsCardProps {
//   title: { en: string; hi: string };   // Multi-language titles
//   value: string | number;
//   change?: string;
//   changeType?: 'positive' | 'negative' | 'neutral';
//   icon: LucideIcon;
//   color: 'blue' | 'yellow' | 'green' | 'red' | 'purple';
//   language: 'en' | 'hi';              // Current language
//   loading?: boolean;                  // Loading state
// }

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600'
};

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  language,
  loading = false
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title[language]}
          </p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              {value}
            </p>
          )}
          {change && !loading && (
            <p
              className={`text-sm mt-2 ${
                changeType === 'positive'
                  ? 'text-green-600'
                  : changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} ${loading ? 'animate-pulse' : ''}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}