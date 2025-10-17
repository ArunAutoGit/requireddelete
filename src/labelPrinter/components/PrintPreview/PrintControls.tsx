/* eslint-disable @typescript-eslint/no-unused-vars */
// PrintControls.tsx
import React from "react";
import { Printer } from "lucide-react";
import { PrintControlsProps } from "../../../admin/types/qrProducts";

// interface PrintControlsProps {
//   isDark: boolean;
//   label: any;
//   onPrintSingle: (id: string) => void;
//   onPrintBatch: () => void;
//   printButtonText: string;
//   showBatchButton?: boolean;
//   batchCount?: number;
// }

const PrintControls: React.FC<PrintControlsProps> = ({
  isDark,
  label,
  onPrintSingle,
  onPrintBatch,
  printButtonText,
  showBatchButton = false,
  batchCount = 0
}) => {
  return (
    <>
      <button
        onClick={() => onPrintSingle(label.id)}
        className="mt-4 flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 active:opacity-80 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        style={{ backgroundColor: "#0066cc" }}
      >
        <Printer className="w-5 h-5" />
        {printButtonText}
      </button>
      
      {showBatchButton && (
        <button
          onClick={onPrintBatch}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 active:opacity-80 transform hover:scale-105 transition-all duration-200 shadow-lg z-10"
          style={{ backgroundColor: "#0066cc" }}
        >
          <Printer className="w-5 h-5" />
          {`Print All (${batchCount})`}
        </button>
      )}
    </>
  );
};

export default PrintControls;