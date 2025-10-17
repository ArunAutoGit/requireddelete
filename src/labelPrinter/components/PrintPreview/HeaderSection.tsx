// HeaderSection.tsx
import React from "react";
import { ArrowLeft } from "lucide-react";

interface HeaderSectionProps {
  isDark: boolean;
  onBack: () => void;
  title: string;
  subtitle: string;
  backButtonText?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isDark,
  onBack,
  title,
  subtitle,
  backButtonText = "Back"
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 mb-4"
        style={{
          backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
          color: isDark ? 'white' : '#334155'
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        {backButtonText}
      </button>
      
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeaderSection;