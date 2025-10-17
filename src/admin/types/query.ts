import { User } from "./user";

export interface Query {
  id: string;
  referenceId: string;
  msrName: string;
  msrId: string;
  queryType: "Technical" | "Payment" | "Product" | "General";
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  priority: "Low" | "Medium" | "High" | "Critical";
  createdDate: string;
  lastUpdated: string;
  assignedTo?: string;
  responses: QueryResponse[];
  attachments?: string[];
}

export interface QueryResponse {
  id: string;
  respondedBy: string;
  response: string;
  timestamp: string;
  isAdmin: boolean;
}


export interface DeleteConfirmationProps {
  isOpen: boolean;
  user: User | null;
  t: any;
  onClose: () => void;
  onConfirm: () => void;
}