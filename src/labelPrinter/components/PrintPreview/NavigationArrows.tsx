// NavigationArrows.tsx
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationArrowsProps {
  isDark: boolean;
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  isDark,
  currentIndex,
  totalItems,
  onPrevious,
  onNext
}) => {
  return (
    <>
      {/* Left Arrow */}
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentIndex === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
        }`}
      >
        <ArrowLeft className="w-8 h-8" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        disabled={currentIndex === totalItems - 1}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentIndex === totalItems - 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
        }`}
      >
        <ArrowRight className="w-8 h-8" />
      </button>
    </>
  );
};

export default NavigationArrows;