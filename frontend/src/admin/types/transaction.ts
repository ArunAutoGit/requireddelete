export interface Transaction {
  id: string;
  msrName: string;
  mechanicName: string;
  validCouponCount: number;
  totalCouponAmount: number;
  approvalTimestamp: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  transactionNumber: string;
  transactionDate: string;
  paymentAmount: number;
  payeeName: string;
  payeeBankAccount: string;
  remarks: string;
}

export interface SummaryCardsProps {
  transactions: Transaction[];
  language: "en" | "hi";
}

export interface TransactionTableProps {
  transactions: Transaction[];
  language: "en" | "hi";
}