import React from 'react';
import { BatchSkeletonProps } from '../../../../admin/types/other';



export const BatchSkeleton: React.FC<BatchSkeletonProps> = ({ isDark }) => {
  return (
    <div className={`rounded-lg shadow-md border overflow-hidden ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className={`h-6 w-24 rounded-full animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
          <div className={`h-5 w-20 rounded-full animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-4 space-y-4">
        {/* Product Info */}
        <div>
          <div className={`h-6 w-32 mb-2 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
          <div className={`h-4 w-24 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`h-4 w-20 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
          <div className={`h-4 w-20 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>
        </div>

        {/* Date */}
        <div className={`h-4 w-28 rounded animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>

        {/* Button */}
        <div className={`h-10 w-full rounded-lg animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
      </div>
    </div>
  );
};

export default BatchSkeleton;
