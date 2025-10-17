
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  selectedValue?: string;
  children: React.ReactNode;
}
export interface SelectValueProps {
  placeholder?: string;
  selectedValue?: string;
}

export interface SelectContentProps {
  isOpen?: boolean;
  children: React.ReactNode;
  handleValueChange?: (value: string) => void;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  handleValueChange?: (value: string) => void;
}

export interface MSRFilterPanelProps {
  startDate: string;
  endDate: string;
  scannerId?: number;
  scannerRole?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onScannerIdChange: (id: number | undefined) => void;
  onScannerRoleChange: (role: string | undefined) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}