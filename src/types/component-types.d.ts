
import React, { AriaAttributes, DOMAttributes } from "react";

// Extend React's intrinsic attributes to include className
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
  
  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }

  // Add className to functional components and intrinsic elements
  interface FunctionComponent<P = {}> {
    (props: P & { className?: string }, context?: any): ReactElement | null;
  }
  
  // Adicionar suporte para componentes do tipo ForwardRefExoticComponent
  type ElementType<P = any, C extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> = 
    | React.JSXElementConstructor<P>
    | React.ForwardRefExoticComponent<P>
    | C;
}

// Add interface for TransactionDatePicker
interface TransactionDatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  selectedDate?: Date;
}

// Add interface for CategorySelector with all required props
interface CategorySelectorProps {
  categoryId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategorySelect: (categoryId: string) => void;
  onReset: (e: React.MouseEvent) => void;
  userSelected: boolean;
  className?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverTriggerProps {
  className?: string;
  asChild?: boolean;
}

interface PopoverContentProps {
  className?: string;
  align?: string;
  sideOffset?: number;
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

// Add interfaces for TransactionDetails
interface TransactionDetailsProps {
  transaction: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  className?: string;
}

// Add interfaces for TransactionControls
interface TransactionControlsProps {
  onClose: () => void;
  onSave: () => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

// Add interfaces for TransactionFormLayout
interface TransactionFormLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Add interfaces for RecurringIndicator
interface RecurringIndicatorProps {
  isRecurring: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isHovered: boolean;
  className?: string;
}

// Add interfaces for DeleteIndicator
interface DeleteIndicatorProps {
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}
