// utils/msrVisitUtils.ts
import { MSRVisit, MSRVisitGrouped } from '../types/msrVisit';

export const formatVisitDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const filterVisitsByLocationMismatch = (visits: MSRVisit[]): MSRVisit[] => {
  return visits.filter(visit => visit.location_mismatch);
};

export const getTotalAmountByMSR = (visits: MSRVisit[]): Record<number, number> => {
  return visits.reduce((acc, visit) => {
    acc[visit.msr_id] = (acc[visit.msr_id] || 0) + visit.coupon_amount;
    return acc;
  }, {} as Record<number, number>);
};