import { StateHeatmapItem } from '../types/analytics';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getIntensityColor = (intensity: number): string => {
  if (intensity > 0.8) return '#16a34a'; // High - green
  if (intensity > 0.5) return '#ca8a04'; // Medium - yellow
  if (intensity > 0.2) return '#ea580c'; // Low-medium - orange
  return '#dc2626'; // Low - red
};

export const sortHeatmapData = (data: StateHeatmapItem[], sortBy: keyof StateHeatmapItem = 'scanned_count', ascending = false): StateHeatmapItem[] => {
  return [...data].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    
    return ascending ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
  });
};

export const filterHeatmapData = (data: StateHeatmapItem[], searchTerm: string): StateHeatmapItem[] => {
  if (!searchTerm) return data;
  
  return data.filter(item =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
};