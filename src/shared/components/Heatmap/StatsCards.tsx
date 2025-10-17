import React from 'react';
import { TrendingUp, MapPin, Calendar, Users } from 'lucide-react';
import { HeatmapData } from '../../types';
import { formatNumber } from '../../utils/colorUtils';

interface StatsCardsProps {
  data: HeatmapData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const totalScans = data.areas.reduce((sum, area) => sum + area.scanCount, 0);
  const totalAreas = data.areas.length;
  const avgScansPerArea = totalAreas > 0 ? Math.round(totalScans / totalAreas) : 0;
  const topArea = data.areas.length > 0 
    ? data.areas.reduce((max, area) => area.scanCount > max.scanCount ? area : max, data.areas[0])
    : null;

  // Use backend summary data if available, otherwise calculate from areas
  const actualTotalScans = data.totalScanned || totalScans;
  const actualTotalStates = data.totalStates || totalAreas;
  const actualTotalMechanics = data.totalMechanics || 0;

  const cards = [
    {
      title: 'Total Scans',
      value: formatNumber(actualTotalScans),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Total States', // Always "States" since we're state-only
      value: actualTotalStates.toString(),
      icon: MapPin,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Total Mechanics',
      value: actualTotalMechanics.toString(),
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Top Performing State',
      value: topArea?.name || 'N/A',
      icon: Calendar,
      color: 'bg-yellow-50 text-yellow-700',
      bgColor: 'bg-yellow-500',
      subtitle: topArea ? formatNumber(topArea.scanCount) : '0'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle} scans</p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
