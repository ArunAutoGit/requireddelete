import React from 'react';
import { Printer, Calendar, Package, IndianRupee } from 'lucide-react';
import { BatchCardProps } from '../../../types/batch';


// interface BatchCardProps {
//   batch: CouponBatchWithProductOut;
//   isDark: boolean;
//   language: 'en' | 'hi';
//   onPrintClick?: (batchId: number) => void; // Add this prop
// }

const BatchCard: React.FC<BatchCardProps> = ({ batch, isDark, language, onPrintClick }) => {
  const texts = {
    en: {
      labels: 'Labels:',
      value: 'Value:',
      created: 'Created:',
      previewPrint: 'Preview & Print'
    },
    hi: {
      labels: 'लेबल:',
      value: 'मूल्य:',
      created: 'बनाया गया:',
      previewPrint: 'पूर्वावलोकन और प्रिंट'
    }
  };

  const currentTexts = texts[language];

  const handlePrint = () => {
    // Call the parent component's function instead of navigate
    if (onPrintClick) {
      onPrintClick(batch.batch_id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`group rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#ffff4d] text-black">
            Batch #{batch.batch_id}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-4 space-y-4">
        {/* Product Info */}
        <div>
          <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {batch.product_details?.product_name}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {batch.product_details?.part_no} • {batch.product_details?.grade}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{currentTexts.labels}</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{batch.quantity}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <IndianRupee className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{currentTexts.value}</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{batch.total_cost}</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{currentTexts.created}</span>
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(batch.created_at)}</span>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full mt-4 py-2 px-4 bg-[#0066cc] text-white rounded-lg font-medium transition-colors hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          {currentTexts.previewPrint}
        </button>
      </div>
    </div>
  );
};

export default BatchCard;