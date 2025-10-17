import React, { useState } from 'react';
import { Download, Filter, Calendar, FileText, BarChart3, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Language content
const translations = {
  en: {
    header: {
      title: "Reports",
      description: "Generate and view detailed reports",
      exportExcel: "Export Excel",
      exportPDF: "Export PDF"
    },
    reportTypes: [
      { id: 'admin', name: 'Admin Report', icon: FileText },
      { id: 'approval', name: 'Approval Status', icon: BarChart3 },
      { id: 'transaction', name: 'Transaction Report', icon: Users },
    ],
    adminReport: {
      title: "Admin Report",
      description: "Detailed administrative data with all fields",
      tableHeaders: [
        "Reference ID",
        "MSR Details",
        "Mechanic",
        "Scan Details",
        "Approval",
        "Status",
        "Actions"
      ],
      actions: {
        view: "View",
        download: "Download",
        approve: "Approve",
        reject: "Reject"
      },
      status: {
        approved: "Approved",
        pending: "Pending",
        paid: "Paid"
      }
    },
    approvalReport: {
      title: "Approval Status Report",
      description: "Review and take action on approval requests",
      tableHeaders: [
        "Reference ID",
        "MSR Details",
        "Mechanic",
        "Scan Details",
        "Approval",
        "Status",
        "Actions"
      ]
    },
    transactionReport: {
      title: "Transaction Report",
      description: "Detailed transaction volume and amounts",
      tableHeaders: [
        "Reference ID",
        "MSR Details",
        "Mechanic",
        "Transaction Date",
        "Amount",
        "Status",
        "Actions"
      ]
    }
  },
  hi: {
    header: {
      title: "रिपोर्ट्स",
      description: "विस्तृत रिपोर्ट जनरेट और देखें",
      exportExcel: "एक्सेल निर्यात करें",
      exportPDF: "PDF निर्यात करें"
    },
    reportTypes: [
      { id: 'admin', name: 'एडमिन रिपोर्ट', icon: FileText },
      { id: 'approval', name: 'अनुमोदन स्थिति', icon: BarChart3 },
      { id: 'transaction', name: 'लेनदेन रिपोर्ट', icon: Users },
    ],
    adminReport: {
      title: "एडमिन रिपोर्ट",
      description: "सभी फ़ील्डों के साथ विस्तृत प्रशासनिक डेटा",
      tableHeaders: [
        "संदर्भ आईडी",
        "एमएसआर विवरण",
        "मैकेनिक",
        "स्कैन विवरण",
        "अनुमोदन",
        "स्थिति",
        "कार्रवाई"
      ],
      actions: {
        view: "देखें",
        download: "डाउनलोड",
        approve: "अनुमोदित करें",
        reject: "अस्वीकार करें"
      },
      status: {
        approved: "अनुमोदित",
        pending: "लंबित",
        paid: "भुगतान किया गया"
      }
    },
    approvalReport: {
      title: "अनुमोदन स्थिति रिपोर्ट",
      description: "अनुमोदन अनुरोधों की समीक्षा करें और कार्रवाई करें",
      tableHeaders: [
        "संदर्भ आईडी",
        "एमएसआर विवरण",
        "मैकेनिक",
        "स्कैन विवरण",
        "अनुमोदन",
        "स्थिति",
        "कार्रवाई"
      ]
    },
    transactionReport: {
      title: "लेनदेन रिपोर्ट",
      description: "विस्तृत लेनदेन मात्रा और राशि",
      tableHeaders: [
        "संदर्भ आईडी",
        "एमएसआर विवरण",
        "मैकेनिक",
        "लेनदेन तिथि",
        "राशि",
        "स्थिति",
        "कार्रवाई"
      ]
    }
  }
};

const transactionData = [
  { month: 'Jan', transactions: 65, amount: 125000 },
  { month: 'Feb', transactions: 89, amount: 178000 },
  { month: 'Mar', transactions: 101, amount: 201000 },
  { month: 'Apr', transactions: 78, amount: 156000 },
  { month: 'May', transactions: 112, amount: 224000 },
  { month: 'Jun', transactions: 95, amount: 190000 },
];

const statusData = [
  { name: 'Approved', value: 68, color: '#10B981' },
  { name: 'Pending', value: 22, color: '#F59E0B' },
  { name: 'Rejected', value: 10, color: '#EF4444' },
];

const adminReportData = [
  {
    id: 'REF001',
    msrName: 'John Doe',
    msrId: 'MSR001',
    mechanicName: 'Ram Kumar',
    scannedDate: '2024-12-10',
    totalCoupons: 25,
    validCoupons: 23,
    totalAmount: 4600,
    approver: 'State Head Mumbai',
    approvalStatus: 'Approved',
    paymentStatus: 'Paid',
    queryRaised: 'No',
    queryStatus: 'N/A',
    remarks: 'All good'
  },
  {
    id: 'REF002',
    msrName: 'Jane Smith',
    msrId: 'MSR002',
    mechanicName: 'Shyam Patel',
    scannedDate: '2024-12-09',
    totalCoupons: 18,
    validCoupons: 16,
    totalAmount: 3200,
    approver: 'State Head Delhi',
    approvalStatus: 'Pending',
    paymentStatus: 'Pending',
    queryRaised: 'Yes',
    queryStatus: 'Open',
    remarks: 'Verification needed'
  }
];

interface ReportsProps {
  language: 'en' | 'hi';
}

export function Reports({ language }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState('admin');
  const [dateRange, setDateRange] = useState('last30days');
  
  const t = translations[language];
  const reportTypes = t.reportTypes;

  const handleExport = (format: 'pdf' | 'excel') => {
    // In a real app, this would generate and download the file
    const fileName = `${selectedReport}_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    console.log(`Exporting ${fileName}`);
  };

  const getStatusText = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'Approved': return t.adminReport.status.approved;
        case 'Pending': return t.adminReport.status.pending;
        case 'Paid': return t.adminReport.status.paid;
        default: return status;
      }
    }
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.header.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.header.description}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>{t.header.exportExcel}</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>{t.header.exportPDF}</span>
          </button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedReport === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'admin' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.adminReport.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.adminReport.description}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0066cc]">
                <tr>
                  {t.adminReport.tableHeaders.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {adminReportData.map((row) => (
                  <tr key={row.id} className="cursor-pointer transition-all duration-200
    hover:bg-[#fff9c4] dark:hover:bg-gray-700/50
    text-gray-900 dark:text-white">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{row.id}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{row.msrName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{row.msrId}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{row.mechanicName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{row.scannedDate}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{row.validCoupons}/{row.totalCoupons} valid</div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">₹{row.totalAmount}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{row.approver}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        row.approvalStatus === 'Approved' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {getStatusText(row.approvalStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          row.paymentStatus === 'Paid' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {getStatusText(row.paymentStatus)}
                        </span>
                        {row.queryRaised === 'Yes' && (
                          <div className="text-xs text-red-600 dark:text-red-400">Query: {row.queryStatus}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                        {t.adminReport.actions.view}
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                        {t.adminReport.actions.download}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     {selectedReport === 'approval' && (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t.approvalReport.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t.approvalReport.description}
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#0066cc]">
          <tr>
            {t.approvalReport.tableHeaders.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {adminReportData.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer transition-all duration-200
              hover:bg-[#fff9c4] dark:hover:bg-gray-700/50
              text-gray-900 dark:text-white"
            >
              {/* Reference ID */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">{row.id}</div>
              </td>

              {/* MSR Details */}
              <td className="px-4 py-4">
                <div className="text-sm">{row.msrName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{row.msrId}</div>
              </td>

              {/* Mechanic */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm">{row.mechanicName}</div>
              </td>

              {/* Scan Details */}
              <td className="px-4 py-4">
                <div className="text-sm">{row.scannedDate}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{row.validCoupons}/{row.totalCoupons} valid</div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">₹{row.totalAmount}</div>
              </td>

              {/* Approval */}
              <td className="px-4 py-4">
                <div className="text-sm">{row.approver}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  row.approvalStatus === 'Approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                }`}>
                  {getStatusText(row.approvalStatus)}
                </span>
              </td>

              {/* Payment/Status */}
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  row.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                }`}>
                  {getStatusText(row.paymentStatus)}
                </span>
              </td>

              {/* Actions → Approve + Reject */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition">
                  {t.adminReport.actions.approve}
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition">
                  {t.adminReport.actions.reject}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


     {selectedReport === 'transaction' && (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t.transactionReport.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t.transactionReport.description}
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#0066cc]">
          <tr>
            {t.transactionReport.tableHeaders.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {adminReportData.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer transition-all duration-200
              hover:bg-[#fff9c4] dark:hover:bg-gray-700/50
              text-gray-900 dark:text-white"
            >
              {/* Reference ID */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">{row.id}</div>
              </td>

              {/* MSR Details */}
              <td className="px-4 py-4">
                <div className="text-sm">{row.msrName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{row.msrId}</div>
              </td>

              {/* Mechanic */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm">{row.mechanicName}</div>
              </td>

              {/* Transaction Date */}
              <td className="px-4 py-4">
                <div className="text-sm">{row.scannedDate}</div>
              </td>

              {/* Amount */}
              <td className="px-4 py-4">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">₹{row.totalAmount}</div>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  row.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                }`}>
                  {getStatusText(row.paymentStatus)}
                </span>
              </td>

              {/* Actions → View / Download */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                  {t.adminReport.actions.view}
                </button>
                <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                  {t.adminReport.actions.download}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
  );
}