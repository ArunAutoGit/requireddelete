// services/printService.ts
export interface PrintLabel {
  sequence: number;
  unique_num: string;
  zpl_code: string;
}

export interface PrintJobRequest {
  batch_id: number;
  printer_type: string;
  labels: PrintLabel[];
}

export interface PrintJobResponse {
  status: string;
  message: string;
  result: {
    batch_id: number;
    total_labels: number;
    successful_prints: number;
    failed_prints: number;
    simulated: boolean;
    details: Array<{
      sequence: number;
      unique_num: string;
      status: string;
    }>;
  };
}

export class PrintService {
  static async sendPrintJob(printJob: PrintJobRequest): Promise<PrintJobResponse> {
    try {
      // FIXED: Use backticks instead of single quotes
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/printer/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printJob),
      });

      if (!response.ok) {
        throw new Error(`Print failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending print job:', error);
      throw error;
    }
  }

  static async getPrinterStatus() {
    try {
      // FIXED: Use backticks instead of single quotes
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/printer/status`);
      return await response.json();
    } catch (error) {
      console.error('Error getting printer status:', error);
      throw error;
    }
  }
}