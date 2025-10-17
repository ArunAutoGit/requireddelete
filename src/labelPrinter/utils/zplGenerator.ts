// utils/zplGenerator.ts
import { LabelData } from "../../admin/types/qrProducts";

// export interface LabelData {
//   id: string;
//   product: string;
//   partNo: string;
//   grade: string;
//   size: string;
//   netQty: string;
//   pkd: string;
//   mrp: string;
//   amount: string;
//   letter?: string;
// }

export class ZPLGenerator {
  private static scaleFn(dpi: number) {
    const scale = dpi / 203;
    return (val: number) => Math.round(val * scale);
  }

  // Convert cm to dots at given DPI
  private static cmToDots(cm: number, dpi: number): number {
    return Math.round((cm / 2.54) * dpi);
  }

  /**
   * Generate ZPL for 8.5cm × 5.5cm label
   * Only includes dynamic content (product details, QR codes, unique number, coupon value)
   * Static elements (header, footer text, borders, yellow box) are pre-printed on the label
   * 
   * Label layout:
   * - Total: 8.5cm × 5.5cm
   * - Header: 1.0cm (static - pre-printed)
   * - Body: 2.8cm (dynamic content)
   * - Footer: 1.7cm (0.5cm red text static, 1.0cm QR area, 0.2cm bottom margin)
   * - Yellow box: 1.5cm × 1.0cm (static box, dynamic amount inside)
   */
  static generateStandardLabelZPL(label: LabelData, dpi: number = 203): string {
    // Label dimensions: 8.5cm × 5.5cm
    const widthDots = this.cmToDots(8.5, dpi);   // ~669 dots at 203 DPI
    const heightDots = this.cmToDots(5.5, dpi);  // ~433 dots at 203 DPI
    
    // Horizontal margins
    const leftMargin = this.cmToDots(0.25, dpi);   // Left edge to text start
    const rightEdge = widthDots - this.cmToDots(0.25, dpi); // Right edge reference
    
    // Vertical positioning
    const headerHeight = this.cmToDots(1.0, dpi);  // 1.0cm header (static)
    const bodyStartY = headerHeight + this.cmToDots(0.18, dpi); // Start after header + separator
    const lineSpacing = this.cmToDots(0.36, dpi);  // Balanced spacing for readability
    
    // Footer positioning
    const footerStartY = headerHeight + this.cmToDots(2.8, dpi) + this.cmToDots(0.62, dpi); // After body + red text area
    
    // QR Code settings
    const qrLeftX = this.cmToDots(0.3, dpi);       // Left QR position
    const qrRightX = widthDots - this.cmToDots(2.2, dpi); // Right QR position - gap from amount
    const qrMagnification = 3;                      // QR code size multiplier
    
    // Yellow box amount position (box is 1.5cm wide, right-aligned within box)
    const yellowBoxRightEdge = widthDots - this.cmToDots(0.15, dpi); // Small margin from actual right edge
    const yellowBoxY = footerStartY + this.cmToDots(0.3, dpi);     // Vertically centered in QR area
    
    // Font sizes - REMOVED DUPLICATE DECLARATIONS
    const bodyFont = 30;       // ~9-10pt for body text
    const letterFont = 55;     // ~16-18pt for letter
    const uniqueFont = 26;     // ~8pt for unique number
    const amountFont = 40;     // ~12pt for amount

    const zpl =
      '^XA\n' +
      '^CI28\n' +  // UTF-8 encoding for Rupee symbol
      '^PON\n' +   // Print orientation normal
      `^PW${widthDots}\n` +
      `^LL${heightDots}\n\n` +
      '~SD15\n\n' +  // Set darkness
      
      // ===== BODY SECTION - Left Column =====
      `^CF0,${bodyFont}\n` +
      `^FO${leftMargin},${bodyStartY}^FDProduct: ${label.product}^FS\n` +
      `^FO${leftMargin},${bodyStartY + lineSpacing}^FDPart No: ${label.partNo}^FS\n` +
      `^FO${leftMargin},${bodyStartY + lineSpacing * 2}^FDGrade: ${label.grade}^FS\n` +
      `^FO${leftMargin},${bodyStartY + lineSpacing * 3}^FDNet Qty: ${label.netQty}^FS\n` +
      `^FO${leftMargin},${bodyStartY + lineSpacing * 4}^FDMRP: ${label.mrp} (Incl. of all taxes)^FS\n\n` +
      
      // ===== BODY SECTION - Right Column =====
      // Letter (large, top right)
      `^CF0,${letterFont}\n` +
      `^FO${rightEdge - this.cmToDots(0.8, dpi)},${bodyStartY}^FD${label.letter || ''}^FS\n\n` +
      
      // Size and PKD (right aligned)
      `^CF0,${bodyFont}\n` +
      `^FO${rightEdge - this.cmToDots(2.5, dpi)},${bodyStartY + lineSpacing * 2}^FDSize: ${label.size}^FS\n` +
      `^FO${rightEdge - this.cmToDots(3.2, dpi)},${bodyStartY + lineSpacing * 3}^FDPKD: ${label.pkd}^FS\n\n` +
      
      // ===== FOOTER SECTION =====
      // Left QR Code (0.9cm size, positioned at left)
      `^FO${qrLeftX},${footerStartY}^BQN,2,${qrMagnification}^FDQA,${label.id}^FS\n` +
      
      // Unique Number (centered between QR codes, below them)
      `^CF0,${uniqueFont}\n` +
      `^FO${Math.round(widthDots / 2) - this.cmToDots(1.8, dpi)},${footerStartY + this.cmToDots(0.85, dpi)}^FD${label.id}^FS\n` +
      
      // Right QR Code (0.9cm size, positioned at right before yellow box)
      `^FO${qrRightX},${footerStartY}^BQN,2,${qrMagnification}^FDQA,${label.id}^FS\n` +
      
      // Amount (right-aligned inside yellow box area)
      `^CF0,${amountFont}\n` +
      `^FO${yellowBoxRightEdge - this.cmToDots(1.0, dpi)},${yellowBoxY}^FD${label.amount}^FS\n\n` +
      
      '^XZ';

    return zpl;
  }

  // 4"×2" scaled variant (QR magnification = 3). Amount is plain text.
  static generateLabelZPL(label: LabelData, dpi: number = 203): string {
    const s = this.scaleFn(dpi);

    const zpl =
      '^XA\n' +
      '^PON\n' +
      `^PW${s(812)}\n` +
      `^LL${s(406)}\n\n` +
      '~SD15\n\n' +
      `^FO${s(20)},${s(20)}^GB${s(772)},${s(2)},${s(2)},B,0^FS\n\n` +
      `^CF0,${s(32)},${s(32)}\n` +
      `^FO${s(35)},${s(35)}^FDProduct: ${label.product}^FS\n\n` +
      `^CF0,${s(60)},${s(60)}\n` +
      `^FO${s(740)},${s(35)}^FD${label.letter || ''}^FS\n\n` +
      `^CF0,${s(24)},${s(24)}\n` +
      `^FO${s(35)},${s(75)}^FDPart No: ${label.partNo}^FS\n\n` +
      `^FO${s(35)},${s(105)}^FDGrade: ${label.grade}^FS\n` +
      `^FO${s(460)},${s(105)}^FDSize: ${label.size}^FS\n\n` +
      `^FO${s(35)},${s(135)}^FDNet Qty: ${label.netQty}^FS\n` +
      `^FO${s(460)},${s(135)}^FDPKD: ${label.pkd}^FS\n\n` +
      `^FO${s(35)},${s(165)}^FDMRP: ₹${label.mrp}^FS\n` +
      `^CF0,${s(18)},${s(18)}\n` +
      `^FO${s(200)},${s(168)}^FD(Incl.of all taxes)^FS\n\n` +
      `^FO${s(20)},${s(205)}^GB${s(772)},${s(2)},${s(2)},B,0^FS\n\n` +
      `^FO${s(35)},${s(220)}^BQN,2,${s(3)}^FDQA,${label.id}^FS\n\n` +
      `^CF0,${s(28)},${s(28)}\n` +
      `^FO${s(220)},${s(268)}^FD${label.id}^FS\n\n` +
      `^FO${s(540)},${s(220)}^BQN,2,${s(3)}^FDQA,${label.id}^FS\n\n` +
      `^CF0,${s(40)},${s(40)}\n` +
      `^FO${s(700)},${s(238)}^FD₹${label.amount}^FS\n\n` +
      '^XZ';

    return zpl;
  }

  // 2"×1.5" compact (QR magnification = 3). Amount is plain text.
  static generateCompactLabelZPL(label: LabelData, dpi: number = 203): string {
    const s = this.scaleFn(dpi);

    const zpl =
      '^XA\n' +
      '^PON\n' +
      `^PW${s(406)}\n` +
      `^LL${s(305)}\n\n` +
      '~SD15\n\n' +
      `^FO${s(10)},${s(10)}^GB${s(386)},${s(1)},${s(1)},B,0^FS\n\n` +
      `^CF0,${s(24)},${s(24)}\n` +
      `^FO${s(15)},${s(18)}^FDProduct: ${label.product}^FS\n\n` +
      `^CF0,${s(18)},${s(18)}\n` +
      `^FO${s(15)},${s(45)}^FDPart No: ${label.partNo}^FS\n` +
      `^FO${s(15)},${s(65)}^FDGrade: ${label.grade}^FS\n` +
      `^FO${s(200)},${s(65)}^FDSize: ${label.size}^FS\n` +
      `^FO${s(15)},${s(85)}^FDNet Qty: ${label.netQty}^FS\n` +
      `^FO${s(200)},${s(85)}^FDPKD: ${label.pkd}^FS\n` +
      `^FO${s(15)},${s(105)}^FDMRP: ₹${label.mrp}^FS\n\n` +
      `^FO${s(10)},${s(130)}^GB${s(386)},${s(1)},${s(1)},B,0^FS\n\n` +
      `^FO${s(15)},${s(140)}^BQN,2,${s(3)}^FDQA,${label.id}^FS\n\n` +
      `^CF0,${s(18)},${s(18)}\n` +
      `^FO${s(120)},${s(198)}^FD${label.id}^FS\n\n` +
      `^FO${s(280)},${s(140)}^BQN,2,${s(3)}^FDQA,${label.id}^FS\n\n` +
      `^CF0,${s(22)},${s(22)}\n` +
      `^FO${s(346)},${s(150)}^FD₹${label.amount}^FS\n\n` +
      '^XZ';

    return zpl;
  }

  static validateZPL(zplCode: string): boolean {
    return zplCode.trim().startsWith('^XA') && zplCode.trim().endsWith('^XZ');
  }

  static generateBatchZPL(labels: LabelData[], dpi: number = 203): string {
    return labels.map(l => this.generateStandardLabelZPL(l, dpi)).join('\n\n');
  }

  static async printLabel(zplCode: string, printerIP?: string): Promise<void> {
    if (!printerIP) {
      const blob = new Blob([zplCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `label_${Date.now()}.zpl`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    await fetch(`http://${printerIP}:9100`, { method: 'POST', body: zplCode, mode: 'no-cors' });
  }

  static getLabelaryPreviewUrl(
    zplCode: string,
    dpi: number = 203,
    width: number = 3.35,  // 8.5cm ≈ 3.35 inches
    height: number = 2.17  // 5.5cm ≈ 2.17 inches
  ): string {
    const encoded = encodeURIComponent(zplCode);
    return `http://api.labelary.com/v1/printers/${dpi}dpmm/labels/${width}x${height}/0/${encoded}`;
  }
}