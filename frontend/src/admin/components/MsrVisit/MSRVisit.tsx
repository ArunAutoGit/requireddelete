import { useState, useMemo, useRef } from "react";
import MSRFilterPanel from "./MSRFilterPanel.tsx";
import { useMSRVisitsGrouped } from "../../hooks/useMSRVisits";
import { MapPin, MSRVisitGrouped } from "../../types/msrVisit";
import Dashboard from "./Dashboard.tsx";

// Simple toast function
const showToast = (title: string, description: string) => {
  alert(`${title}: ${description}`);
};

// Utility functions
const formatDate = (date: Date, formatStr: string) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (formatStr === "yyyy-MM-dd") return `${year}-${month}-${day}`;
  if (formatStr === "MMM dd, yyyy") {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[date.getMonth()]} ${day}, ${year}`;
  }
  if (formatStr === "hh:mm a") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toISOString().split("T")[0];
};

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const MSRVisits = () => {
  const [startDate, setStartDate] = useState(
    formatDate(subDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(formatDate(new Date(), "yyyy-MM-dd"));
  const [scannerId, setScannerId] = useState<number | undefined>();
  const [scannerRole, setScannerRole] = useState<string | undefined>();
  const [selectedPinId, setSelectedPinId] = useState<number | undefined>();

  // Row refs for table
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  const dateRangeColors = [
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#eab308",
  ];

  const params = {
    start_date: startDate,
    end_date: endDate,
    scanner_id: scannerId,
    scanner_role: scannerRole,
  };
  const {
    data: visits,
    isLoading,
    error,
    refetch,
  } = useMSRVisitsGrouped(params);

  // Convert visits to map pins
  const mapPins: MapPin[] = useMemo(() => {
    if (!visits) return [];
    const pins: MapPin[] = [];

    visits.forEach((visit) => {
      const visitDate = new Date(visit.visit_datetime);
      const color =
        dateRangeColors[visitDate.getDay() % dateRangeColors.length];

      // Scheduled pin
      if (visit.scheduled_lat && visit.scheduled_lng) {
        pins.push({
          id: visit.scan_batch_id,
          lat: visit.scheduled_lat,
          lng: visit.scheduled_lng,
          type: "scheduled",
          mismatch: false,
          visit,
          color,
          marker: undefined
        });
      }

      // Scanned pin
      if (visit.scanned_lat && visit.scanned_lng) {
        const isDiff =
          !visit.scheduled_lat ||
          !visit.scheduled_lng ||
          Math.abs(visit.scanned_lat - visit.scheduled_lat) > 0.001 ||
          Math.abs(visit.scanned_lng - visit.scheduled_lng) > 0.001;
        if (isDiff) {
          pins.push({
            id: visit.scan_batch_id + 10000,
            lat: visit.scanned_lat,
            lng: visit.scanned_lng,
            type: "scanned",
            mismatch: visit.location_mismatch,
            visit,
            color: visit.location_mismatch ? "#ef4444" : color,
            marker: undefined
          });
        }
      }
    });

    return pins;
  }, [visits]);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPinId(pin.visit.scan_batch_id);
    showToast(
      "Location Selected",
      `${pin.visit.msr_name} visit to ${pin.visit.mechanic_name}`
    );
  };

  const handleRowClick = (visit: MSRVisitGrouped) =>
    setSelectedPinId(visit.scan_batch_id);

  const handleRefresh = () => {
    refetch();
    showToast("Data Refreshed", "MSR visits data has been updated");
  };

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            MSR Visits & Payments Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track MSR visits, coupon redemptions, and location data in an
            integrated map and table view
          </p>
        </div>

        {/* Filters */}
        <MSRFilterPanel
          startDate={startDate}
          endDate={endDate}
          scannerId={scannerId}
          scannerRole={scannerRole}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onScannerIdChange={setScannerId}
          onScannerRoleChange={setScannerRole}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Dashboard with map + table */}
        <Dashboard
          pins={mapPins}
          visits={visits || []}
          selectedPinId={selectedPinId}
          onRowClick={handleRowClick}
          onPinClick={handlePinClick}
          rowRefs={rowRefs}
          dateRangeColors={dateRangeColors}
        />
      </div>
    </div>
  );
};

export default MSRVisits;
