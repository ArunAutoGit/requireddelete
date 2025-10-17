import React, { ReactNode, HTMLAttributes } from "react";
import { format } from "date-fns";
import { MSRVisitGrouped, MSRVisitsTableProps } from "../../types/msrVisit";
import clsx from "clsx";

// ================= Table Components =================
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}
export const Table: React.FC<TableProps> = ({ children, ...props }) => (
  <table
    className="w-full text-sm border-collapse"
    {...props}
  >
    {children}
  </table>
);

interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}
export const TableHeader: React.FC<TableSectionProps> = ({
  children,
  ...props
}) => (
  <thead className="bg-[#0066cc] text-white sticky top-0 z-10" {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<TableSectionProps> = ({
  children,
  ...props
}) => <tbody className="divide-y divide-gray-200" {...props}>{children}</tbody>;

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = "", ...props }, ref) => (
    <tr ref={ref} className={clsx("hover:bg-gray-50", className)} {...props}>
      {children}
    </tr>
  )
);

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}
export const TableHead: React.FC<TableHeadProps> = ({ children, ...props }) => (
  <th
    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
    {...props}
  >
    {children}
  </th>
);

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  ...props
}) => (
  <td
    className={clsx("px-6 py-4 text-sm text-gray-900", className)}
    {...props}
  >
    {children}
  </td>
);

// ================= Card Components =================
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <div
    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, ...props }) => (
  <div className="px-6 py-4 border-b border-gray-200" {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, ...props }) => (
  <h3
    className="text-lg font-semibold text-gray-900"
    {...props}
  >
    {children}
  </h3>
);

export const CardContent: React.FC<CardProps> = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

// ================= Badge Component =================
interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary";
}
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  ...props
}) => {
  const variantClasses = {
    default: "bg-[#0066cc] text-white",
    destructive: "bg-red-100 text-red-700 border border-red-200",
    outline: "bg-gray-100 text-gray-700 border border-gray-200",
    secondary: "bg-green-100 text-green-700 border border-green-200",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant]
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// interface MSRVisitsTableProps {
//   visits: MSRVisitGrouped[];
//   selectedPinId?: number;
//   onRowClick?: (visit: MSRVisitGrouped) => void;
//   dateRangeColors: string[];
//   rowRefs?: React.MutableRefObject<Record<number, HTMLTableRowElement | null>>;
// }

const MSRVisitTable: React.FC<MSRVisitsTableProps> = ({
  visits,
  selectedPinId,
  onRowClick,
  dateRangeColors,
  rowRefs,
}) => {
  const getDateRangeColor = (visitDate: string) => {
    const date = new Date(visitDate);
    const dayOfWeek = date.getDay();
    return dateRangeColors[dayOfWeek % dateRangeColors.length];
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>MSR Visits & Payments</CardTitle>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {visits.length} visits
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="overflow-hidden">
          {/* Fixed header container */}
          <div className="overflow-y-auto no-scrollbar max-h-[calc(100vh-280px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 z-20">Date & Time</TableHead>
                  <TableHead className="sticky top-0 z-20">MSR</TableHead>
                  <TableHead className="sticky top-0 z-20">Mechanic</TableHead>
                  <TableHead className="sticky top-0 z-20 text-center">Coupons</TableHead>
                  <TableHead className="sticky top-0 z-20 text-center">Amount</TableHead>
                  <TableHead className="sticky top-0 z-20">Location</TableHead>
                  <TableHead className="sticky top-0 z-20 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit, index) => (
                  <TableRow
                    key={visit.scan_batch_id}
                    ref={(el) =>
                      rowRefs && (rowRefs.current[visit.scan_batch_id] = el)
                    }
                    className={clsx(
                      "cursor-pointer transition-colors duration-150",
                      selectedPinId === visit.scan_batch_id && 
                      "bg-blue-50 border-l-4 border-[#0066cc]"
                    )}
                    onClick={() => onRowClick?.(visit)}
                  >
                    {/* Date */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {format(new Date(visit.visit_datetime), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {format(new Date(visit.visit_datetime), "hh:mm a")}
                        </span>
                      </div>
                    </TableCell>

                    {/* MSR */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {visit.msr_name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          ID: {visit.msr_id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Mechanic */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {visit.mechanic_name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          ID: {visit.mechanic_id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Coupons */}
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {visit.total_coupons}
                      </Badge>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-center">
                      <span className="font-medium text-green-700">
                        {formatCurrency(visit.total_amount)}
                      </span>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      {visit.scanned_address ? (
                        <div
                          className="text-xs text-gray-600 max-w-[180px] truncate"
                          title={visit.scanned_address}
                        >
                          {visit.scanned_address}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No address</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {visit.location_mismatch ? (
                          <Badge
                            variant="destructive"
                            title="Location does not match"
                          >
                            Mismatch
                          </Badge>
                        ) : (
                          <Badge variant="secondary" title="Location matches">
                            Match
                          </Badge>
                        )}
                        <div
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{
                            backgroundColor: getDateRangeColor(
                              visit.visit_datetime
                            ),
                          }}
                          title="Date range indicator"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Empty state */}
            {visits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-base font-medium mb-1">No visits found</h3>
                <p className="text-sm">Try adjusting your filters or date range</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MSRVisitTable;