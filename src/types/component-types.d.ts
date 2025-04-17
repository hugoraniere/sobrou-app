
import { AriaAttributes, DOMAttributes } from "react";

// Extend React's intrinsic attributes to include className
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
  
  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
}

// Add interface for TransactionDatePicker
interface TransactionDatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  // Add the alternative prop names that are used in some components
  selectedDate?: Date;
}

// Add interface for CategorySelector
interface CategorySelectorProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
  // Add props used in the current implementation
  categoryId?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onCategorySelect?: (categoryId: string) => void;
  onReset?: (e: React.MouseEvent) => void;
  userSelected?: boolean;
}

// Add interfaces for Dialog components
interface DialogProps {
  className?: string;
}

interface DialogContentProps {
  className?: string;
}

// Add interfaces for Popover components
interface PopoverProps {
  className?: string;
}

interface PopoverContentProps {
  className?: string;
  align?: string;
}

// Add interfaces for EditTransactionDialog
interface EditTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
  className?: string;
}

// Add interfaces for AddTransactionDialog
interface AddTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTransactionAdded: () => void;
  className?: string;
}

// Add interfaces for TransactionRow
interface TransactionRowProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
  className?: string;
}

