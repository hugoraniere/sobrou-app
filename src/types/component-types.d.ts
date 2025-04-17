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
}

// Add interface for CategorySelector
interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}
