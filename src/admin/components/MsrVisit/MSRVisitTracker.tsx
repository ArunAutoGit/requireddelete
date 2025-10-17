import React, { useState, useMemo } from 'react';
import { useMSRVisits, useMSRVisitsGrouped } from '../../hooks/useMSRVisits';
import { MSRVisitsParams, MapPin, MSRVisitGrouped } from '../../types/msrVisit';
import MSRVisitMap from './GoogleMap';
import MSRVisitTable from './MSRVisitTable';
import FilterPanel from './MSRFilterPanel.tsx';

// Color palette for different date ranges
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
  '#FB5607', '#8338EC', '#3A86FF'
];

const MSRVisitTracker: React.FC = () => {
  // Individual state for filter panel props
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [scannerId, setScannerId] = useState<number | undefined>();
  const [scannerRole, setScannerRole] = useState<string | undefined>();
  const [selectedPinId, setSelectedPinId] = useState<number | undefined>();

  // Build params object for API calls
  const params: MSRVisitsParams = {
    start_date: startDate,
    end_date: endDate,
    scanner_id: scannerId,
    scanner_role: scannerRole,
  };

  const { data: visits, isLoading: visitsLoading, refetch } = useMSRVisits(params);
  const { data: groupedVisits, isLoading: groupedLoading } = useMSRVisitsGrouped(params);

  // Prepare map pins from grouped visits
  const mapPins: MapPin[] = useMemo(() => {
    if (!groupedVisits) return [];
    
    const pins: MapPin[] = [];
    
    groupedVisits.forEach((visit, index) => {
      // Determine color based on date
      const visitDate = new Date(visit.visit_datetime);
      const daysDiff = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      const colorIndex = Math.min(daysDiff, COLOR_PALETTE.length - 1);
      const color = COLOR_PALETTE[colorIndex];
      
      // Add scheduled location pin
      if (visit.scheduled_lat && visit.scheduled_lng) {
        pins.push({
          id: visit.scan_batch_id, // Use scan_batch_id instead of mechanic_id
          lat: visit.scheduled_lat,
          lng: visit.scheduled_lng,
          type: 'scheduled',
          mismatch: visit.location_mismatch,
          visit,
          color,
          marker: undefined
        });
      }
      
      // Add scanned location pin if different from scheduled
      if (visit.scanned_lat && visit.scanned_lng && visit.location_mismatch) {
        pins.push({
          id: visit.scan_batch_id + 10000, // Offset to avoid ID conflicts
          lat: visit.scanned_lat,
          lng: visit.scanned_lng,
          type: 'scanned',
          mismatch: visit.location_mismatch,
          visit,
          color: '#FF0000',
          marker: undefined
        });
      }
    });
    
    return pins;
  }, [groupedVisits]);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPinId(pin.visit.scan_batch_id);
  };

  const handleRowClick = (visit: MSRVisitGrouped) => {
    setSelectedPinId(visit.scan_batch_id);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (visitsLoading || groupedLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading MSR visits data...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-5 bg-gray-50">
      {/* Filter Panel with correct props */}
      <FilterPanel
        startDate={startDate}
        endDate={endDate}
        scannerId={scannerId}
        scannerRole={scannerRole}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onScannerIdChange={setScannerId}
        onScannerRoleChange={setScannerRole}
        onRefresh={handleRefresh}
        isLoading={visitsLoading || groupedLoading}
      />
      
      <div className="flex flex-1 gap-5 mt-5 min-h-0">
        <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <MSRVisitMap 
            pins={mapPins}
            onPinClick={handlePinClick}
          />
        </div>
        
        <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm flex flex-col">
          {/* Use groupedVisits instead of visits */}
          <MSRVisitTable 
            visits={groupedVisits || []}
            selectedPinId={selectedPinId}
            onRowClick={handleRowClick}
            dateRangeColors={COLOR_PALETTE}
          />
        </div>
      </div>
    </div>
  );
};

export default MSRVisitTracker;