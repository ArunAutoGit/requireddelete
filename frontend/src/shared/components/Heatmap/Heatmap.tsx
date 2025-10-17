import React, { useState, useCallback } from "react";
import { Maximize2 } from "lucide-react";
import Tooltip from "./Tooltip";
import { FilterState, HeatmapData, TooltipData } from "../../types";
import {
  formatDateRange,
  formatNumber,
  getHeatColor,
  getTextColor,
} from "../../utils/colorUtils";

interface HeatmapProps {
  data: HeatmapData;
  filters: FilterState;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, filters }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBlockHover = useCallback(
    (area: any, event: React.MouseEvent) => {
      const container = (event.currentTarget as HTMLElement).closest(
        ".heatmap-container"
      ) as HTMLElement;

      const containerRect = container.getBoundingClientRect();

      // Calculate date range from filters
      let dateRangeText = "Current period";
      if (filters.timeScope !== "custom") {
        dateRangeText = filters.timeScope
          .replace("last", "Last ")
          .toUpperCase();
      } else if (filters.customDateRange) {
        dateRangeText = formatDateRange(
          filters.customDateRange.start,
          filters.customDateRange.end
        );
      }

      setTooltip({
        regionName: area.name,
        totalScans: area.scanCount,
        dateRange: dateRangeText,
        uniqueMechanics: area.uniqueMechanics,
        averageDailyScans: area.averageDailyScans,
        scanIntensity: area.scanIntensity,
        position: {
          x: event.clientX - containerRect.left + 12, // offset
          y: event.clientY - containerRect.top + 12,
        },
      });
      setShowTooltip(true);
    },
    [filters]
  );

  const handleBlockLeave = useCallback(() => {
    setShowTooltip(false);
    setTooltip(null);
  }, []);

  if (data.areas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          No data available for the selected filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 border-b border-gray-200"
        style={{
          background: "linear-gradient(135deg, #0066cc 0%, #ffff4d 100%)",
        }}
      >
        <div>
          <h2 className="text-xl font-bold text-white drop-shadow-md">
            India - State Level Analysis
          </h2>
          <p className="text-sm text-white/90 drop-shadow-sm">
            Showing coupon scanning activity density across Indian states
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Maximize2 className="w-5 h-5 text-white drop-shadow-sm" />
          <span className="text-sm text-white/90 drop-shadow-sm">
            State View
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative p-8 heatmap-container">
        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 p-6">
          {/* State blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.areas.map((area) => {
              const backgroundColor = getHeatColor(
                area.scanCount,
                data.maxScanCount
              );
              const textColor = getTextColor(backgroundColor);

              return (
                <div
                  key={area.id}
                  className={`relative border-2 border-gray-300 transition-all duration-300 rounded-lg p-4 min-h-[120px] flex flex-col justify-center items-center hover:border-blue-600 hover:shadow-xl hover:scale-105 cursor-default ${
                    area.scanCount === 0 ? "opacity-70" : ""
                  }`}
                  style={{
                    backgroundColor,
                    borderColor: area.scanCount > 0 ? "#0066cc" : "#d1d5db",
                  }}
                  onMouseEnter={(e) => handleBlockHover(area, e)}
                  onMouseLeave={handleBlockLeave}
                >
                  {/* State label */}
                  <div className="text-center">
                    <div
                      className="text-sm font-bold leading-tight mb-2 drop-shadow-sm"
                      style={{ color: textColor }}
                    >
                      {area.name}
                    </div>
                    <div
                      className="text-lg font-bold drop-shadow-sm"
                      style={{ color: textColor }}
                    >
                      {formatNumber(area.scanCount)}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: textColor, opacity: 0.8 }}
                    >
                      scans
                    </div>
                    {area.uniqueMechanics && (
                      <div
                        className="text-xs mt-1 font-medium"
                        style={{ color: textColor, opacity: 0.8 }}
                      >
                        {area.uniqueMechanics} mechanics
                      </div>
                    )}
                  </div>

                  {/* Subtle border highlight for active states */}
                  {area.scanCount > 0 && (
                    <div
                      className="absolute inset-0 rounded-lg border-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ borderColor: "#ffff4d" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tooltip */}
          <Tooltip data={tooltip} visible={showTooltip} />
        </div>

        {/* Info message */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Hover over states to see detailed scanning statistics
        </p>
      </div>
    </div>
  );
};

export default Heatmap;
