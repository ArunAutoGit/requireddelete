import React, { useEffect } from "react";
import LeafletMap from "./LeafletMap";
import MSRVisitTable from "./MSRVisitTable";
import { MapPin, MSRVisitGrouped } from "../../types/msrVisit";

interface DashboardProps {
  pins: MapPin[];
  visits: MSRVisitGrouped[];
  selectedPinId?: number;
  onRowClick: (visit: MSRVisitGrouped) => void;
  onPinClick: (pin: MapPin) => void;
  rowRefs: React.MutableRefObject<Record<number, HTMLTableRowElement | null>>;
  dateRangeColors: string[];
}

const Dashboard: React.FC<DashboardProps> = ({
  pins,
  visits,
  selectedPinId,
  onRowClick,
  onPinClick,
  rowRefs,
  dateRangeColors,
}) => {
  // Scroll to table row when selectedPinId changes
  useEffect(() => {
    if (selectedPinId && rowRefs.current[selectedPinId]) {
      rowRefs.current[selectedPinId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedPinId]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
      {/* Map Panel */}
      <div className="h-full">
        <LeafletMap
          pins={pins}
          selectedPinId={selectedPinId}
          onPinClick={onPinClick}
        />
      </div>

      {/* Table Panel - REMOVED overflow-auto */}
      <div className="h-full">
        <MSRVisitTable
          visits={visits}
          selectedPinId={selectedPinId}
          onRowClick={onRowClick}
          dateRangeColors={dateRangeColors}
          rowRefs={rowRefs}
        />
      </div>
    </div>
  );
};

export default Dashboard;
