// components/products/UploadModal.tsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { UploadModalProps } from '../../../types/products';

// interface UploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUpload: (file: File) => void;
//   language: 'en' | 'hi';
//   isUploading: boolean;
// }

const translations = {
  en: {
    title: "Upload Product Data",
    description: "Upload Excel or CSV file",
    chooseFile: "Choose File",
    supportedFormats: "Supported formats: .xlsx, .xls, .csv",
    maxSize: "Maximum file size: 10MB",
    cancel: "Cancel",
    upload: "Upload",
    uploading: "Uploading...",
    selectedFile: "Selected file:",
    selectFile: "Please select a file"
  },
  hi: {
    title: "उत्पाद डेटा अपलोड करें",
    description: "एक्सेल या सीएसवी फाइल अपलोड करें",
    chooseFile: "फ़ाइल चुनें",
    supportedFormats: "समर्थित प्रारूप: .xlsx, .xls, .csv",
    maxSize: "अधिकतम फाइल आकार: 10MB",
    cancel: "रद्द करें",
    upload: "अपलोड करें",
    uploading: "अपलोड हो रहा है...",
    selectedFile: "चयनित फ़ाइल:",
    selectFile: "कृपया एक फ़ाइल चुनें"
  }
};

export function UploadModal({ isOpen, onClose, onUpload, language, isUploading }: UploadModalProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const t = translations[language];

  if (!isOpen) return null;

  const handleUpload = () => {
    if (!uploadFile) {
      alert(t.selectFile);
      return;
    }
    onUpload(uploadFile);
    setUploadFile(null);
  };

  const handleClose = () => {
    setUploadFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.title}
        </h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {t.description}
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-[#0066cc] hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors mb-2"
            >
              {t.chooseFile}
            </label>
            {uploadFile && (
              <p className="text-sm text-green-600">
                {t.selectedFile} {uploadFile.name}
              </p>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <p>{t.supportedFormats}</p>
            <p>{t.maxSize}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleUpload}
            disabled={!uploadFile || isUploading}
            className="px-4 py-2 rounded-lg bg-[#0066cc] text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isUploading ? t.uploading : t.upload}
          </button>
        </div>
      </div>
    </div>
  );
}
