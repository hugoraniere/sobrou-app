
import { AriaAttributes, DOMAttributes } from "react";

// Add className to React components that need it
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
}

// Add interface for TransactionDatePicker
interface TransactionDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  // Add the alternative prop names that are used in some components
  selectedDate?: Date;
}

// Add interface for CategorySelector
interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
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

// Add interfaces for Popover components
interface PopoverProps {
  className?: string;
}
