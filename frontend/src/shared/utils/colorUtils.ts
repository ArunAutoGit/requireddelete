export const getHeatColor = (scanCount: number, maxScanCount: number): string => {
  if (maxScanCount === 0) return '#f5f5f5';
  
  const intensity = scanCount / maxScanCount;
  
  if (intensity === 0) return '#f5f5f5'; // Light grey for no activity
  if (intensity <= 0.2) return '#e6f3ff'; // Very light blue
  if (intensity <= 0.4) return '#b3d9ff'; // Light blue
  if (intensity <= 0.6) return '#0066cc'; // Primary Blue
  if (intensity <= 0.8) return '#ffff80'; // Light Yellow (tinted)
  if (intensity <= 0.9) return '#ffff4d'; // Primary Yellow
  return '#e6cc00'; // Darker yellow for highest activity
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return `${startDate.toLocaleDateString('en-GB', options)} - ${endDate.toLocaleDateString('en-GB', options)}`;
};

// Helper function to determine if text should be dark or light based on background
export const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
};