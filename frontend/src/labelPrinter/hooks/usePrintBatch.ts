// hooks/usePrintBatch.ts
import { useState } from 'react';
import { PrintService, PrintJobRequest } from '../services/printService';
import { ZPLGenerator, LabelData } from '../utils/zplGenerator';

interface UsePrintBatchReturn {
  isPrinting: boolean;
  printStatus: string | null;
  printBatch: (labels: LabelData[], batchId: number) => Promise<void>;
  resetPrintStatus: () => void;
}

export const usePrintBatch = (): UsePrintBatchReturn => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  const printBatch = async (labels: LabelData[], batchId: number): Promise<void> => {
    if (labels.length === 0) return;
    
    setIsPrinting(true);
    setPrintStatus(`Preparing ${labels.length} labels for printing...`);

    try {
      // Step 1: Generate ZPL codes for all labels
      setPrintStatus('Generating ZPL codes...');
      
      const labelsWithZPL = labels.map((label, index) => ({
        sequence: index + 1,
        unique_num: label.id,
        zpl_code: ZPLGenerator.generateLabelZPL(label)
      }));

      // Step 2: Create print job payload
      const printJob: PrintJobRequest = {
        batch_id: batchId,
        printer_type: "zpl",
        labels: labelsWithZPL
      };

      // Step 3: Send to backend
      setPrintStatus(`Printing ${labels.length} labels to barcode printer...`);
      
      const result = await PrintService.sendPrintJob(printJob);

      // Step 4: Handle response
      if (result.status === "completed") {
        const successCount = result.result.successful_prints;
        const totalCount = result.result.total_labels;
        
        if (successCount === totalCount) {
          setPrintStatus(`✅ Successfully printed all ${successCount} labels!`);
        } else if (successCount > 0) {
          setPrintStatus(`⚠️ Printed ${successCount} out of ${totalCount} labels`);
        } else {
          setPrintStatus(`❌ No labels were printed successfully`);
        }
      } else {
        throw new Error(result.message || 'Printing failed');
      }

    } catch (error: any) {
      console.error('Print error:', error);
      setPrintStatus(`❌ Printing failed: ${error.message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  const resetPrintStatus = () => {
    setPrintStatus(null);
  };

  return {
    isPrinting,
    printStatus,
    printBatch,
    resetPrintStatus
  };
};