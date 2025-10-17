import React, { useState } from 'react';
import { Download, Eye, Calendar, Search, Filter, FileText, FileSpreadsheet } from 'lucide-react';

interface ReportsProps {
  isDark: boolean;
  language: 'en' | 'hi';
}

interface Report {
  id: string;
  partName: string;
  labelsCount: number;
  productCost: number;
  totalCost: number;
  dateTime: string;
  partNo: string;
  status: 'completed' | 'pending' | 'failed';
}

const translations = {
  en: {
    title: 'Reports',
    subtitle: 'View and download printed batch reports',
    searchPlaceholder: 'Search by product name or part number...',
    printedBatches: 'Printed Batches',
    reportDetails: 'Report Details',
    productName: 'Product Name',
    labelsPrinted: 'Labels Printed',
    productCost: 'Product Cost',
    totalCost: 'Total Cost',
    downloadPDF: 'Download PDF',
    downloadExcel: 'Download Excel',
    status: {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed'
    },
    columns: {
      reportId: 'Report ID',
      partName: 'Part Name',
      labelsCount: 'Labels Printed',
      productCost: 'Product Cost',
      totalCost: 'Total Cost',
      dateTime: 'Date/Time',
      status: 'Status',
      actions: 'Actions'
    }
  },
  hi: {
    title: 'रिपोर्ट्स',
    subtitle: 'मुद्रित बैच रिपोर्ट देखें और डाउनलोड करें',
    searchPlaceholder: 'उत्पाद नाम या पार्ट नंबर से खोजें...',
    printedBatches: 'मुद्रित बैच',
    reportDetails: 'रिपोर्ट विवरण',
    productName: 'उत्पाद का नाम',
    labelsPrinted: 'मुद्रित लेबल',
    productCost: 'उत्पाद लागत',
    totalCost: 'कुल लागत',
    downloadPDF: 'PDF डाउनलोड करें',
    downloadExcel: 'एक्सेल डाउनलोड करें',
    status: {
      completed: 'पूर्ण',
      pending: 'लंबित',
      failed: 'असफल'
    },
    columns: {
      reportId: 'रिपोर्ट आईडी',
      partName: 'पार्ट नाम',
      labelsCount: 'मुद्रित लेबल',
      productCost: 'उत्पाद लागत',
      totalCost: 'कुल लागत',
      dateTime: 'तारीख/समय',
      status: 'स्थिति',
      actions: 'कार्रवाई'
    }
  }
};

export default function Reports({ isDark, language }: ReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const t = translations[language];

  // Sample reports data
  const sampleReports: Report[] = [
    {
      id: 'RPT001',
      partName: 'Castrol GTX 15W-40',
      labelsCount: 50,
      productCost: 450,
      totalCost: 100,
      dateTime: '2024-01-15 14:30:00',
      partNo: 'GTX-15W40-1L',
      status: 'completed'
    },
    {
      id: 'RPT002',
      partName: 'Castrol Activ 20W-50',
      labelsCount: 25,
      productCost: 520,
      totalCost: 50,
      dateTime: '2024-01-15 11:15:00',
      partNo: 'ACT-20W50-1L',
      status: 'completed'
    },
    {
      id: 'RPT003',
      partName: 'Castrol Power1 10W-30',
      labelsCount: 75,
      productCost: 380,
      totalCost: 150,
      dateTime: '2024-01-14 16:45:00',
      partNo: 'PWR1-10W30-1L',
      status: 'pending'
    }
  ];

  const filteredReports = sampleReports.filter(report => {
    return (
      (!searchTerm || 
        report.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.partNo.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (!dateRange || report.dateTime.includes(dateRange))
    );
  });

  const handleDownloadPDF = (report: Report) => {
    console.log('Downloading PDF for report:', report.id);
    // Implementation for PDF download
  };

  const handleDownloadExcel = (report: Report) => {
    console.log('Downloading Excel for report:', report.id);
    // Implementation for Excel download
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h2>
        <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
          {t.subtitle}
        </p>
      </div>

      {/* Search and Filters */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        p-6 rounded-xl border shadow-sm space-y-4
      `}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30 focus:border-[#ffff4d]
              `}
            />
          </div>
          
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`
                pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
                }
                focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30 focus:border-[#ffff4d]
              `}
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        rounded-xl border shadow-sm overflow-hidden
      `}>
        <div className="p-6 border-b border-inherit">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.printedBatches} ({filteredReports.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-[#0066cc]' : 'bg-[#0066cc]'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.reportId}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.partName}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.labelsCount}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.productCost}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.totalCost}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.dateTime}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.status}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}>
                  {t.columns.actions}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${selectedReport?.id === report.id
                      ? 'bg-[#ffff4d]/10 border-l-4 border-[#ffff4d]' // Selected
                      : isDark
                        ? 'hover:bg-gray-700/50' // Hover in dark mode
                        : 'hover:bg-[#fff9c4]' // Light mode
                    }
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium">{report.partName}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {report.partNo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {report.labelsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ₹{report.productCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    ₹{report.totalCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(report.dateTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {t.status[report.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(report);
                        }}
                        className={`
                          p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                          ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                        `}
                        title={t.downloadPDF}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadExcel(report);
                        }}
                        className={`
                          p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                          ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                        `}
                        title={t.downloadExcel}
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Report Details */}
      {selectedReport && (
        <div className={`
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          p-6 rounded-xl border shadow-sm
        `}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.reportDetails} - {selectedReport.id}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadPDF(selectedReport)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#0066cc] to-[#0066cc]/90 text-white rounded-lg hover:from-[#0066cc]/90 hover:to-[#0066cc] transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleDownloadExcel(selectedReport)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#ffff4d] to-[#ffff4d]/80 text-gray-900 rounded-lg hover:from-[#ffff4d]/90 hover:to-[#ffff4d] transition-all duration-200"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.productName}
              </div>
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedReport.partName}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedReport.partNo}
              </div>
            </div>
            
            <div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.labelsPrinted}
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-[#ffff4d]' : 'text-[#0066cc]'}`}>
                {selectedReport.labelsCount}
              </div>
            </div>
            
            <div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.productCost}
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₹{selectedReport.productCost}
              </div>
            </div>
            
            <div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.totalCost}
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                ₹{selectedReport.totalCost}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}