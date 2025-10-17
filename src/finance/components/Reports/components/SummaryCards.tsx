import React from 'react';
import { labels } from '../constants/labels';
import { SummaryCardsProps } from '../../../../admin/types/transaction';



// interface SummaryCardsProps {
//   transactions: Transaction[];
//   language: 'en' | 'hi';
// }

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, language }) => {
  const text = labels[language];
  
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.totalCouponAmount, 0);
  const totalTransactions = transactions.length;
  const paidTransactions = transactions.filter(t => t.paymentStatus === "Paid").length;

  const cards = [
    {
      title: text.totalTransactions,
      value: totalTransactions.toString(),
      subtitle: text.thisPeriod,
      borderColor: 'border-l-[#0066cc]'
    },
    {
      title: text.totalAmount,
      value: `₹${totalAmount.toLocaleString()}`,
      subtitle: text.acrossAllTransactions,
      borderColor: 'border-l-yellow-500'
    },
    {
      title: text.paymentSuccessRate,
      value: `${totalTransactions > 0 ? Math.round((paidTransactions / totalTransactions) * 100) : 0}%`,
      subtitle: `${paidTransactions} ${text.paidOf} ${totalTransactions}`,
      borderColor: 'border-l-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${card.borderColor}`}>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
