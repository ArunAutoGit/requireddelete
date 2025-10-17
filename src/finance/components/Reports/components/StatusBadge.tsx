import React from 'react';
import { labels } from '../constants/labels';
import { StatusBadgeProps } from '../../../../admin/types/other';

// interface StatusBadgeProps {
//   status: string;
//   language: 'en' | 'hi';
// }

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, language }) => {
  const text = labels[language];
  
  const statusConfig = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    Failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  
  const statusTranslations: Record<string, string> = {
    Paid: text.paymentStatus.paid,
    Pending: text.paymentStatus.pending,
    Failed: text.paymentStatus.failed,
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config}`}>
      {statusTranslations[status] || status}
    </span>
  );
};
