import React, { useState, useEffect } from 'react';
import { SummaryCards } from './components/SummaryCards';
import { FiltersSection } from './components/FiltersSection';
import { TransactionTable } from './components/TransactionTable';
import { mockTransactions, Transaction } from './data/mockData';
import { ReportsProps } from '../../../admin/types/components';



const Reports: React.FC<ReportsProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("monthly");
  const [filteredData, setFilteredData] = useState<Transaction[]>(mockTransactions);

  // Filter data based on search term
  useEffect(() => {
    const filtered = mockTransactions.filter(transaction =>
      transaction.msrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.mechanicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`);
    
    if (format === 'csv') {
      const headers = [
        'Reference ID', 'MSR Name', 'Mechanic Name', 'Coupon Count', 
        'Total Amount', 'Approval Time', 'Payment Status', 'Transaction No',
        'Transaction Date', 'Payment Amount', 'Payee Name', 'Bank Account', 'Remarks'
      ];
      
      const csvContent = [
        headers.join(','),
        ...filteredData.map(transaction => [
          transaction.id,
          transaction.msrName,
          transaction.mechanicName,
          transaction.validCouponCount,
          transaction.totalCouponAmount,
          transaction.approvalTimestamp,
          transaction.paymentStatus,
          transaction.transactionNumber,
          transaction.transactionDate,
          transaction.paymentAmount,
          transaction.payeeName,
          transaction.payeeBankAccount,
          transaction.remarks
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transaction_reports_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    
    // PDF export would be implemented here with a library like jsPDF
    if (format === 'pdf') {
      alert('PDF export functionality would be implemented here');
    }
  };

  return (
    <div className="space-y-6">
      <SummaryCards 
        transactions={filteredData} 
        language={language} 
      />
      
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={handleExport}
        language={language}
      />
      
      <TransactionTable 
        transactions={filteredData}
        language={language}
      />
    </div>
  );
};

export default Reports;
