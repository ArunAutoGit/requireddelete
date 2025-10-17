import React from 'react';
import { getHeatColor } from '../../utils/colorUtils';


interface LegendProps {
  maxScanCount: number;
}

const Legend: React.FC<LegendProps> = ({ maxScanCount }) => {
  const legendSteps = [
    { intensity: 0, label: 'No Activity' },
    { intensity: 0.2, label: 'Low' },
    { intensity: 0.4, label: 'Medium' },
    { intensity: 0.6, label: 'High' },
    { intensity: 0.8, label: 'Very High' },
    { intensity: 1.0, label: 'Highest' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Intensity</h3>
      
      <div className="space-y-3">
        {legendSteps.map((step, index) => {
          const color = getHeatColor(step.intensity * maxScanCount, maxScanCount);
          const scanCount = Math.round(step.intensity * maxScanCount);
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 flex-1">{step.label}</span>
              <span className="text-xs text-gray-500 font-mono">
                {scanCount.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Colors represent relative scan density within the current view.
        </p>
      </div>
    </div>
  );
};

export default Legend;