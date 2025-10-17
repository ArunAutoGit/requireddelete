// components/PrintStatus.tsx
import React from 'react';

interface PrintStatusProps {
  status: string | null;
  isPrinting: boolean;
  className?: string;
}

const PrintStatus: React.FC<PrintStatusProps> = ({ 
  status, 
  isPrinting, 
  className = '' 
}) => {
  if (!status) return null;

  const getStatusStyles = () => {
    if (status.includes('✅')) {
      return 'bg-green-100 text-green-800 border border-green-200';
    } else if (status.includes('⚠️')) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else if (status.includes('❌')) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else {
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getStatusStyles()} ${className}`}>
      <div className="flex items-center gap-2">
        {isPrinting && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        )}
        <span className="font-medium">{status}</span>
      </div>
    </div>
  );
};

export default PrintStatus;