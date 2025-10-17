import React from "react";
import tvsLogo from '../../../logo/tvs_sbl.png';

interface LabelDisplayProps {
  label: any;
  isDark: boolean;
  language: "en" | "hi";
  translations: any;
  previewStatic?: boolean;
}

const CM_W = 8.5;
const CM_H = 5.5;

const LabelDisplay: React.FC<LabelDisplayProps> = ({
  label,
  language,
  translations,
  previewStatic = true
}) => {
  const t = translations[language];

  return (
    <div
      id={`label-${label.id}`}
      style={{
        width: `${CM_W}cm`,
        height: `${CM_H}cm`,
        maxWidth: `${CM_W}cm`,
        maxHeight: `${CM_H}cm`,
        minWidth: `${CM_W}cm`,
        minHeight: `${CM_H}cm`,
        boxSizing: "border-box",
        background: "#fff",
        border: "2px solid #000",
        position: "relative",
        fontFamily: "'Arial Narrow','Helvetica Condensed','Arial',sans-serif",
        color: "#000",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header Section - 1.0 cm */}
      <div
        style={{
          height: "1.0cm",
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        {/* Logo - Left aligned */}
        <div style={{ flexShrink: 0 }}>
          <img 
            src={tvsLogo} 
            alt="TVS Logo" 
            style={{ 
              height: 24,
              width: 46
            }} 
          />
        </div>

        {/* Company details - Centered in the remaining space */}
        <div style={{ 
          flex: 1, 
          textAlign: "center", 
          lineHeight: 1.2,
          minWidth: 0
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#cc0000" }}>
            SUNDARAM BRAKE LININGS LIMITED
          </div>
          <div style={{ fontSize: 10, color: "#cc0000" }}>
            PADI, CHENNAI 600 050.
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div style={{ borderTop: "2px solid #000" }} />

      {/* Body Section - 2.8 cm */}
      <div
        style={{
          height: "2.8cm",
          width: "100%",
          padding: "6px 20px 6px 16px",
          boxSizing: "border-box",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "12px"
        }}
      >
        {/* Left column - Product details */}
        <div style={{ fontSize: 9, fontWeight: 700 }}>
          {/* Product */}
          <div>
            <span>{t.productLabel}: </span>
            <span>{label.product}</span>
          </div>

          {/* Part No */}
          <div style={{ marginTop: 4 }}>
            <span>{t.partNoLabel}: </span>
            <span>{label.partNo}</span>
          </div>

          {/* Grade */}
          <div style={{ marginTop: 4 }}>
            <span>{t.gradeLabel}: </span>
            <span>{label.grade}</span>
          </div>

          {/* Net Qty */}
          <div style={{ marginTop: 4 }}>
            <span>{t.netQtyLabel}: </span>
            <span>{label.netQty}</span>
          </div>

          {/* MRP */}
          <div style={{ marginTop: 4 }}>
            <span>{t.mrpLabel}: ₹</span>
            <span>{label.mrp}</span>
            <span style={{ fontSize: 7 }}> (Incl. of all taxes)</span>
          </div>
        </div>

        {/* Right column - Size and Letter */}
        <div style={{ fontSize: 9, fontWeight: 700, display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Letter S */}
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: "right" }}>{label.letter}</div>
          
          {/* Size */}
          <div style={{ textAlign: "right" }}>
            <span>{t.sizeLabel}: </span>
            <span>{label.size}</span>
          </div>

          {/* PKD */}
          <div style={{ textAlign: "right" }}>
            <span>{t.pkdLabel}: </span>
            <span>{label.pkd}</span>
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div style={{ borderTop: "2px solid #000" }} />

      {/* Footer Section - 1.7 cm */}
      <div
        style={{
          height: "1.7cm",
          width: "100%",
          padding: "3px 12px 4px 12px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Consumer Care Info - Red text */}
        <div style={{ fontSize: 7, color: "#cc0000", lineHeight: 1.2 }}>
          <div>Consumer Care Officer Tel No. 073580 17893</div>
          <div>E Mail: repl@tvssbl.com</div>
        </div>

        {/* Bottom row: QR codes, unique number, yellow box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4
          }}
        >
          {/* Left QR Code */}
          <div style={{ flexShrink: 0 }}>
            {label?.qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${label.qrCodeBase64}`}
                alt="QR"
                style={{ width: "0.9cm", height: "0.9cm", display: "block" }}
              />
            ) : (
              <div style={{ width: "0.9cm", height: "0.9cm", background: "#f0f0f0" }} />
            )}
          </div>

          {/* Center: Unique number */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {label.id}
          </div>

          {/* Right QR Code */}
          <div style={{ flexShrink: 0 }}>
            {label?.qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${label.qrCodeBase64}`}
                alt="QR"
                style={{ width: "0.9cm", height: "0.9cm", display: "block" }}
              />
            ) : (
              <div style={{ width: "0.9cm", height: "0.9cm", background: "#f0f0f0" }} />
            )}
          </div>

          {/* Yellow price box */}
          <div
            style={{
              width: "1.3cm",
              height: "0.9cm",
              background: "#FFFF00",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            ₹{label.amount}
          </div>
        </div>
      </div>

      {/* Print rules */}
      <style>{`
        @media print {
          @page { size: ${CM_W}cm ${CM_H}cm; margin: 0; }
          #label-${label.id} {
            width: ${CM_W}cm !important;
            height: ${CM_H}cm !important;
            max-width: ${CM_W}cm !important;
            max-height: ${CM_H}cm !important;
            min-width: ${CM_W}cm !important;
            min-height: ${CM_H}cm !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default LabelDisplay;