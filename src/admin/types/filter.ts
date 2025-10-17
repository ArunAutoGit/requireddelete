import { FormUserRole } from "./user";

export interface FiltersProps {
  searchTerm: string;
  selectedRole: FormUserRole | 'all';
  selectedStatus: string;
  itemsPerPage: number;
  t: any;
  onSearchChange: (term: string) => void;
  onRoleChange: (role: FormUserRole | 'all') => void;
  onStatusChange: (status: string) => void;
  onItemsPerPageChange: (items: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  t: any;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  onExport: (format: string) => void;
  language: "en" | "hi";
}