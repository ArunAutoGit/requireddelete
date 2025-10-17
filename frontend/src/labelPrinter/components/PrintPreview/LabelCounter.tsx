// LabelCounter.tsx
import React from "react";

interface LabelCounterProps {
  isDark: boolean;
  currentIndex: number;
  totalItems: number;
}

const LabelCounter: React.FC<LabelCounterProps> = ({
  isDark,
  currentIndex,
  totalItems
}) => {
  return (
    <div className={`px-6 py-3 rounded-lg font-medium text-lg ${
      isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
    }`}>
      {currentIndex + 1} of {totalItems}
    </div>
  );
};

export default LabelCounter;