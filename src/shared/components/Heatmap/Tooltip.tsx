import React from "react";
import { TooltipData } from "../../types/index";
import { formatNumber } from "../../utils/colorUtils";

interface TooltipProps {
  data: TooltipData | null;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ data, visible }) => {
  if (!visible || !data) return null;

  const tooltipWidth = 260;
  const tooltipHeight = 130;

  const container = document.querySelector(".heatmap-container") as HTMLElement;
  const containerRect = container?.getBoundingClientRect();

  let left = data.position.x + 12;
  let top = data.position.y - tooltipHeight - 12;
  let arrowOnTop = false;

  if (containerRect) {
    // Flip horizontally if too far right
    if (left + tooltipWidth > containerRect.width) {
      left = containerRect.width - tooltipWidth - 8;
    }
    // If not enough space above, place below cursor
    if (top < 0) {
      top = data.position.y + 12;
      arrowOnTop = true;
    }
  }

  return (
    <div
      className="absolute z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl pointer-events-none transition-all duration-150"
      style={{
        left,
        top,
        width: tooltipWidth,
        minHeight: tooltipHeight,
      }}
    >
      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-400">{data.regionName}</h4>
        <div className="text-sm space-y-1">
          <p className="flex justify-between">
            <span className="text-gray-300">Total Scans:</span>
            <span className="font-semibold text-green-400">
              {formatNumber(data.totalScans)}
            </span>
          </p>
          {data.uniqueMechanics !== undefined && (
            <p className="flex justify-between">
              <span className="text-gray-300">Unique Mechanics:</span>
              <span className="font-semibold text-purple-400">
                {data.uniqueMechanics}
              </span>
            </p>
          )}
          {data.averageDailyScans !== undefined && (
            <p className="flex justify-between">
              <span className="text-gray-300">Avg Daily Scans:</span>
              <span className="font-semibold text-cyan-400">
                {formatNumber(data.averageDailyScans)}
              </span>
            </p>
          )}
          {data.scanIntensity !== undefined && (
            <p className="flex justify-between">
              <span className="text-gray-300">Scan Intensity:</span>
              <span className="font-semibold text-orange-400">
                {data.scanIntensity.toFixed(2)}
              </span>
            </p>
          )}
          <p className="flex justify-between">
            <span className="text-gray-300">Period:</span>
            <span className="text-blue-300 text-xs">{data.dateRange}</span>
          </p>
        </div>
      </div>

      {/* Arrow */}
      <div
        className={`absolute left-6 w-0 h-0 border-l-6 border-r-6 ${
          arrowOnTop
            ? "border-b-6 border-l-transparent border-r-transparent border-b-gray-900 top-[-6px]"
            : "border-t-6 border-l-transparent border-r-transparent border-t-gray-900 bottom-[-6px]"
        }`}
      />
    </div>
  );
};

export default Tooltip;
