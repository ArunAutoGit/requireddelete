import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Printer} from "lucide-react";

// Import components
import HeaderSection from "./HeaderSection";
import LabelDisplay from "./LabelDisplay";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import LabelCounter from "./LabelCounter";
import { ZPLGenerator } from "../../utils/zplGenerator";
import { HTMLLabelGenerator } from "../../utils/htmlLabelGenerator";
import { ApiResponse, LabelData, PrintPreviewProps } from "../../../admin/types/qrProducts";

const translations = {
  en: {
    printButton: "Print",
    deleteLabel: "Delete",
    productLabel: "Product",
    partNoLabel: "Part No",
    gradeLabel: "Grade",
    sizeLabel: "Size",
    netQtyLabel: "Net Qty",
    pkdLabel: "PKD",
    mrpLabel: "MRP",
    confirmDelete: "Are you sure you want to delete this label?",
    cancel: "Cancel",
    delete: "Delete",
    title: "Print Preview",
    subtitle: "labels ready for printing",
    labelPreview: "Label Preview",
    pageInfo: "Showing all {count} labels",
    backButton: "Back",
    printAll: "Print All Batch",
    printing: "Printing...",
    preparingLabels: "Preparing {count} labels for printing...",
    generatingZPL: "Generating ZPL codes...",
    sendingToPrinter: "Printing {count} labels to barcode printer...",
    printSuccess: "✅ Successfully printed all {count} labels!",
    printPartialSuccess: "⚠️ Printed {success} out of {total} labels",
    printFailed: "❌ No labels were printed successfully",
    printError: "❌ Printing failed: {error}",
  },
  hi: {
    printButton: "प्रिंट",
    deleteLabel: "हटाएं",
    productLabel: "उत्पाद",
    partNoLabel: "पार्ट नंबर",
    gradeLabel: "ग्रेड",
    sizeLabel: "आकार",
    netQtyLabel: "शुद्ध मात्रा",
    pkdLabel: "पैकिंग तिथि",
    mrpLabel: "एमआरपी",
    confirmDelete: "क्या आप वाकई इस लेबल को हटाना चाहते हैं?",
    cancel: "रद्द करें",
    delete: "हटाएं",
    title: "प्रिंट पूर्वावलोकन",
    subtitle: "प्रिंटिंग के लिए तैयार लेबल",
    labelPreview: "लेबल पूर्वावलोकन",
    pageInfo: "सभी {count} लेबल दिखा रहा है",
    backButton: "वापस",
    printAll: "सभी प्रिंट करें",
    printing: "प्रिंटिंग...",
    preparingLabels: "{count} लेबल तैयार किए जा रहे हैं...",
    generatingZPL: "ZPL कोड जेनरेट किए जा रहे हैं...",
    sendingToPrinter: "बारकोड प्रिंटर को {count} लेबल भेजे जा रहे हैं...",
    printSuccess: "✅ सभी {count} लेबल सफलतापूर्वक प्रिंट हो गए!",
    printPartialSuccess: "⚠️ {success} लेबल {total} में से प्रिंट हो गए",
    printFailed: "❌ कोई भी लेबल प्रिंट नहीं हो सका",
    printError: "❌ प्रिंटिंग विफल: {error}",
  },
};

// Print service functions
const sendPrintJobToBackend = async (printJob: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printJob),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Print failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending print job:', error);
    throw error;
  }
};

const PrintPreview: React.FC<PrintPreviewProps> = ({ 
  isDark, 
  onTabChange, 
  language, 
  printData 
}) => {
  const t = translations[language];
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  // Function to convert API data to label format
  const convertApiDataToLabels = (data: ApiResponse): LabelData[] => {
    if (!data) return [];
    
    const { product, qr_codes } = data;
    
    return qr_codes.map((qrCode) => ({
      id: qrCode.unique_num,
      product: product.product_name,
      partNo: product.part_no,
      grade: product.grade,
      size: product.size1 || "N/A",
      netQty: `${product.net_qty_inner} pcs`,
      pkd: product.pkd_date,
      mrp: product.mrp_inner.toString(),
      amount: product.mechanic_coupon_inner?.toString() || product.mrp_inner.toString(),
      letter: product.product_name.charAt(0).toUpperCase(),
      qrCodeBase64: qrCode.qr_code_base64
    }));
  };

  // Print to Barcode Printer and Browser
  const handlePrintBatch = async () => {
    if (labels.length === 0) return;
    
    setIsPrinting(true);
    setPrintStatus(t.preparingLabels.replace('{count}', labels.length.toString()));

    try {
      // Step 1: Generate ZPL codes for all labels using ZPLGenerator
      setPrintStatus(t.generatingZPL);
      
      const labelsWithZPL = labels.map((label, index) => ({
        sequence: index + 1,
        unique_num: label.id,
        zpl_code: ZPLGenerator.generateStandardLabelZPL(label, 203)
      }));

      // Step 2: Create print job payload
      const printJob = {
        batch_id: printData?.batch_id || 0,
        printer_type: "zpl",
        labels: labelsWithZPL
      };

      // Step 3: Send to backend
      setPrintStatus(t.sendingToPrinter.replace('{count}', labels.length.toString()));
      
      const result = await sendPrintJobToBackend(printJob);

      // Step 4: Handle response
      if (result.status === "completed") {
        const successCount = result.result.successful_prints;
        const totalCount = result.result.total_labels;
        
        if (successCount === totalCount) {
          setPrintStatus(t.printSuccess.replace('{count}', successCount.toString()));
        } else if (successCount > 0) {
          setPrintStatus(
            t.printPartialSuccess
              .replace('{success}', successCount.toString())
              .replace('{total}', totalCount.toString())
          );
        } else {
          setPrintStatus(t.printFailed);
        }
        
        // Trigger browser print dialog using HTML labels
        HTMLLabelGenerator.printLabels(labels);
        
        // Auto-clear success messages after 3 seconds
        setTimeout(() => {
          setPrintStatus(null);
        }, 3000);
        
      } else {
        throw new Error(result.message || 'Printing failed');
      }

    } catch (error: any) {
      console.error('Print error:', error);
      setPrintStatus(t.printError.replace('{error}', error.message));
      
      // Show error for 5 seconds
      setTimeout(() => {
        setPrintStatus(null);
      }, 5000);
    } finally {
      setIsPrinting(false);
    }
  };

  // Effect to process API data when component mounts or printData changes
  useEffect(() => {
    if (printData) {
      const processedLabels = convertApiDataToLabels(printData);
      setLabels(processedLabels);
      setCurrentLabelIndex(0);
    } else {
      setLabels([]);
      setCurrentLabelIndex(0);
    }
  }, [printData]);

  const deleteLabel = (id: string) => {
    const labelIndex = labels.findIndex(label => label.id === id);
    setLabels((prev) => prev.filter((label) => label.id !== id));
    
    // Adjust current index if needed
    if (labelIndex <= currentLabelIndex && currentLabelIndex > 0) {
      setCurrentLabelIndex(prev => prev - 1);
    } else if (currentLabelIndex >= labels.length - 1 && labels.length > 1) {
      setCurrentLabelIndex(prev => prev - 1);
    }
    
    setDeleteConfirm(null);
  };

  const goToPreviousLabel = () => {
    setCurrentLabelIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextLabel = () => {
    setCurrentLabelIndex(prev => Math.min(labels.length - 1, prev + 1));
  };

  // Get status display styles
  const getStatusStyles = () => {
    if (!printStatus) return '';
    
    if (printStatus.includes('✅')) {
      return 'bg-green-100 text-green-800 border border-green-200';
    } else if (printStatus.includes('⚠️')) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else if (printStatus.includes('❌')) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else {
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className={`p-4 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Header Section */}
      <HeaderSection
        isDark={isDark}
        onBack={() => onTabChange("generate")}
        title={t.title}
        subtitle={`${labels.length} ${t.subtitle}`}
        backButtonText={t.backButton}
      />

      {/* Print All Button */}
      {labels.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintBatch}
            disabled={isPrinting}
            className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-lg ${
              isPrinting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:opacity-90 hover:scale-105 active:opacity-80'
            }`}
          >
            <Printer className="w-5 h-5" />
            {isPrinting ? t.printing : `${t.printAll} (${labels.length})`}
          </button>
        </div>
      )}

      {/* Print Status Display */}
      {printStatus && (
        <div className={`mb-4 p-4 rounded-lg ${getStatusStyles()}`}>
          <div className="flex items-center gap-2">
            {isPrinting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            )}
            <span className="font-medium">{printStatus}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        rounded-xl border shadow-sm overflow-hidden
      `}>
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.labelPreview}
            </h3>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {labels.length > 0 ? `${currentLabelIndex + 1} of ${labels.length}` : '0 of 0'}
            </div>
          </div>
        </div>

        <div className="p-6">
          {labels.length > 0 ? (
            <div className="flex flex-col items-center space-y-6">
              {/* Label Counter */}
              <LabelCounter
                isDark={isDark}
                currentIndex={currentLabelIndex}
                totalItems={labels.length}
              />

              {/* Label with Side Arrows - Centered with max-width constraint */}
              <div className="flex items-center justify-center gap-6 w-full" style={{ maxWidth: '1200px' }}>
                {/* Left Arrow */}
                <button
                  onClick={goToPreviousLabel}
                  disabled={currentLabelIndex === 0}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    currentLabelIndex === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  <ArrowLeft className="w-7 h-7" />
                </button>

                {/* Label Display - Centered without extra margin */}
                <div className="flex items-center justify-center" style={{ minHeight: '5.5cm' }}>
                  <LabelDisplay
                    label={labels[currentLabelIndex]}
                    isDark={isDark}
                    language={language}
                    translations={translations}
                    previewStatic={true}
                  />
                </div>

                {/* Right Arrow */}
                <button
                  onClick={goToNextLabel}
                  disabled={currentLabelIndex === labels.length - 1}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    currentLabelIndex === labels.length - 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  <ArrowRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No labels available
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDark={isDark}
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteLabel(deleteConfirm)}
        confirmText={t.delete}
        cancelText={t.cancel}
        title={t.confirmDelete}
      />
    </div>
  );
};

export default PrintPreview;