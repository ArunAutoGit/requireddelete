// utils/htmlLabelGenerator.ts
import { LabelData } from "../../admin/types/qrProducts";

export class HTMLLabelGenerator {
  /**
   * Generate HTML for 8.5cm × 5.5cm label matching ZPL layout
   * This matches the generateStandardLabelZPL output
   */
  static generateStandardLabelHTML(label: LabelData): string {
    // Convert QR code base64 to data URL if not already
    const qrDataUrl = label.qrCodeBase64?.startsWith('data:') 
      ? label.qrCodeBase64 
      : `data:image/png;base64,${label.qrCodeBase64}`;

    return `
      <div class="label-container" style="
        width: 8.5cm;
        height: 5.5cm;
        border: 1px solid #000;
        position: relative;
        background: white;
        font-family: Arial, sans-serif;
        page-break-after: always;
        page-break-inside: avoid;
        box-sizing: border-box;
      ">
        <!-- Header Section (1.0cm) - Static pre-printed area -->
        <div style="
          height: 1.0cm;
          border-bottom: 2px solid #000;
          background: #f5f5f5;
        "></div>

        <!-- Body Section (2.8cm) -->
        <div style="
          padding: 0.18cm 0.25cm 0;
          position: relative;
          height: 2.8cm;
        ">
          <!-- Left Column -->
          <div style="
            float: left;
            width: 65%;
            font-size: 9pt;
            line-height: 1.4;
          ">
            <div><strong>Product:</strong> ${label.product}</div>
            <div><strong>Part No:</strong> ${label.partNo}</div>
            <div><strong>Grade:</strong> ${label.grade}</div>
            <div><strong>Net Qty:</strong> ${label.netQty}</div>
            <div><strong>MRP:</strong> ₹${label.mrp} (Incl. of all taxes)</div>
          </div>

          <!-- Right Column -->
          <div style="
            float: right;
            width: 30%;
            text-align: right;
          ">
            <!-- Letter -->
            <div style="
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 0.3cm;
            ">${label.letter || ''}</div>
            
            <!-- Size and PKD -->
            <div style="font-size: 9pt; line-height: 1.4;">
              <div><strong>Size:</strong> ${label.size}</div>
              <div><strong>PKD:</strong> ${label.pkd}</div>
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>

        <!-- Footer Section (1.7cm) -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.7cm;
          padding: 0 0.15cm;
        ">
          <!-- Red text area (0.5cm) - Static pre-printed -->
          <div style="
            height: 0.5cm;
            background: #ffe5e5;
          "></div>

          <!-- QR and Amount area (1.0cm) -->
          <div style="
            position: relative;
            height: 1.0cm;
            padding-top: 0.1cm;
          ">
            <!-- Left QR Code -->
            <div style="
              position: absolute;
              left: 0.3cm;
              top: 0.1cm;
              width: 0.9cm;
              height: 0.9cm;
            ">
              <img src="${qrDataUrl}" style="width: 100%; height: 100%;" alt="QR" />
            </div>

            <!-- Unique Number (centered) -->
            <div style="
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              bottom: 0.05cm;
              font-size: 8pt;
              white-space: nowrap;
            ">${label.id}</div>

            <!-- Right QR Code -->
            <div style="
              position: absolute;
              right: 1.7cm;
              top: 0.1cm;
              width: 0.9cm;
              height: 0.9cm;
            ">
              <img src="${qrDataUrl}" style="width: 100%; height: 100%;" alt="QR" />
            </div>

            <!-- Yellow Box with Amount -->
            <div style="
              position: absolute;
              right: 0.15cm;
              top: 0.1cm;
              width: 1.5cm;
              height: 1.0cm;
              background: #ffeb3b;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12pt;
              font-weight: bold;
            ">₹${label.amount}</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate batch HTML for all labels
   */
  static generateBatchHTML(labels: LabelData[]): string {
    return labels.map(label => this.generateStandardLabelHTML(label)).join('\n');
  }

  /**
   * Generate complete HTML document for printing
   */
  static generatePrintDocument(labels: LabelData[]): string {
    const labelsHTML = this.generateBatchHTML(labels);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Print Labels</title>
        <style>
          @page {
            size: 8.5cm 5.5cm;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .label-container {
            margin: 0;
            padding: 0;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .label-container {
              page-break-after: always;
              page-break-inside: avoid;
            }
            
            .label-container:last-child {
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        ${labelsHTML}
      </body>
      </html>
    `;
  }

  /**
   * Create a printable blob URL
   */
  static createPrintableURL(labels: LabelData[]): string {
    const html = this.generatePrintDocument(labels);
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  /**
   * Trigger print dialog with labels
   */
  static printLabels(labels: LabelData[]): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generatePrintDocument(labels));
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for images to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  }
}