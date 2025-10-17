import React from 'react';
import { FileDown } from 'lucide-react';
import { labels } from '../constants/labels';
import { StatusBadge } from './StatusBadge';

import { Transaction, TransactionTableProps } from '../../../../admin/types/transaction';

// interface TransactionTableProps {
//   transactions: Transaction[];
//   language: 'en' | 'hi';
// }

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, language }) => {
  const text = labels[language];

  const handleIndividualDownload = (transaction: Transaction) => {
    const headers = [
      'Reference ID', 'MSR Name', 'Mechanic Name', 'Coupon Count', 
      'Total Amount', 'Approval Time', 'Payment Status', 'Transaction No',
      'Transaction Date', 'Payment Amount', 'Payee Name', 'Bank Account', 'Remarks'
    ];
    
    const csvContent = [
      headers.join(','),
      [
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
      ].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction_${transaction.id}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions found matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
      <div className="pb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">{text.tableHeaders.referenceId}</th>
              <th className="px-6 py-3">{text.tableHeaders.msrName}</th>
              <th className="px-6 py-3">{text.tableHeaders.mechanicName}</th>
              <th className="px-6 py-3 text-right">{text.tableHeaders.couponCount}</th>
              <th className="px-6 py-3 text-right">{text.tableHeaders.totalAmount}</th>
              <th className="px-6 py-3">{text.tableHeaders.approvalTime}</th>
              <th className="px-6 py-3">{text.tableHeaders.status}</th>
              <th className="px-6 py-3">{text.tableHeaders.transactionNo}</th>
              <th className="px-6 py-3">{text.tableHeaders.transactionDate}</th>
              <th className="px-6 py-3 text-right">{text.tableHeaders.paymentAmount}</th>
              <th className="px-6 py-3">{text.tableHeaders.payeeName}</th>
              <th className="px-6 py-3">{text.tableHeaders.bankAccount}</th>
              <th className="px-6 py-3">{text.tableHeaders.remarks}</th>
              <th className="px-6 py-3 w-20">{text.tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 font-mono text-sm">{transaction.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{transaction.msrName}</td>
                <td className="px-6 py-4">{transaction.mechanicName}</td>
                <td className="px-6 py-4 text-right">{transaction.validCouponCount}</td>
                <td className="px-6 py-4 text-right">₹{transaction.totalCouponAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{transaction.approvalTimestamp}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={transaction.paymentStatus} language={language} />
                </td>
                <td className="px-6 py-4 font-mono text-sm">{transaction.transactionNumber}</td>
                <td className="px-6 py-4">{transaction.transactionDate}</td>
                <td className="px-6 py-4 text-right">₹{transaction.paymentAmount.toLocaleString()}</td>
                <td className="px-6 py-4">{transaction.payeeName}</td>
                <td className="px-6 py-4 font-mono">{transaction.payeeBankAccount}</td>
                <td className="px-6 py-4 max-w-xs truncate" title={transaction.remarks}>{transaction.remarks}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleIndividualDownload(transaction)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-[#0066cc] hover:text-white text-gray-600 dark:text-gray-400"
                    title={`${text.downloadTitle} ${transaction.id}`}
                  >
                    <FileDown className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
