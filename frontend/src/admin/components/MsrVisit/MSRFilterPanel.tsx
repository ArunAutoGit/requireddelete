import React, { useState } from 'react';
import { Calendar, Filter, RefreshCw, ChevronDown } from 'lucide-react';
import { ButtonProps, MSRFilterPanelProps, SelectContentProps, SelectItemProps, SelectProps, SelectTriggerProps, SelectValueProps } from '../../types/msrFilter';

// Inline UI Components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
));
CardContent.displayName = "CardContent";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
//   size?: 'default' | 'sm' | 'lg' | 'icon';
// }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    {...props}
  />
));
Label.displayName = "Label";

// interface SelectProps {
//   value?: string;
//   onValueChange?: (value: string) => void;
//   children: React.ReactNode;
// }

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            setIsOpen,
            selectedValue,
            handleValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   isOpen?: boolean;
//   setIsOpen?: (open: boolean) => void;
//   selectedValue?: string;
//   children: React.ReactNode;
// }

// ✅ Fixed SelectTrigger - filter out custom props
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ 
    className, 
    isOpen, 
    setIsOpen, 
    selectedValue, 
    children, 
    onClick,
    ...validHTMLProps // Only valid HTML props will be spread
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen?.(!isOpen);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        onClick={handleClick}
        {...validHTMLProps} // Only spread valid HTML button attributes
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// interface SelectValueProps {
//   placeholder?: string;
//   selectedValue?: string;
// }

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, selectedValue }) => {
  const getDisplayValue = () => {
    if (!selectedValue) return placeholder;
    
    // Map values to display text
    const displayMap: Record<string, string> = {
      'all': 'All Roles',
      'msr': 'MSR',
      'statehead': 'State Head',
      'zonalhead': 'Zonal Head'
    };
    
    return displayMap[selectedValue] || selectedValue;
  };

  return <span>{getDisplayValue()}</span>;
};

// interface SelectContentProps {
//   isOpen?: boolean;
//   children: React.ReactNode;
//   handleValueChange?: (value: string) => void;
// }

const SelectContent: React.FC<SelectContentProps> = ({ isOpen, children, handleValueChange }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-[2000] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 bg-white zoom-in-95 top-full mt-1">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            handleValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// interface SelectItemProps {
//   value: string;
//   children: React.ReactNode;
//   handleValueChange?: (value: string) => void;
// }

const SelectItem: React.FC<SelectItemProps> = ({ value, children, handleValueChange }) => (
  <div
    className="relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
    onClick={() => handleValueChange?.(value)}
  >
    {children}
  </div>
);

// interface MSRFilterPanelProps {
//   startDate: string;
//   endDate: string;
//   scannerId?: number;
//   scannerRole?: string;
//   onStartDateChange: (date: string) => void;
//   onEndDateChange: (date: string) => void;
//   onScannerIdChange: (id: number | undefined) => void;
//   onScannerRoleChange: (role: string | undefined) => void;
//   onRefresh: () => void;
//   isLoading?: boolean;
// }

const MSRFilterPanel: React.FC<MSRFilterPanelProps> = ({
  startDate,
  endDate,
  scannerId,
  scannerRole,
  onStartDateChange,
  onEndDateChange,
  onScannerIdChange,
  onScannerRoleChange,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Date Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scannerRole">Scanner Role</Label>
            <Select value={scannerRole || 'all'} onValueChange={(value) => onScannerRoleChange(value === 'all' ? undefined : value)}>
              <SelectTrigger id="scannerRole">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="msr">MSR</SelectItem>
                <SelectItem value="statehead">State Head</SelectItem>
                <SelectItem value="zonalhead">Zonal Head</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scannerId">Scanner ID (Optional)</Label>
            <Input
              id="scannerId"
              type="number"
              placeholder="Enter Scanner ID"
              value={scannerId || ''}
              onChange={(e) => onScannerIdChange(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div className="flex items-end">
            <Button 
              onClick={onRefresh} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MSRFilterPanel;
