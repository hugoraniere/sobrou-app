
import React, { AriaAttributes, DOMAttributes, ForwardRefExoticComponent, ReactElement, ReactNode, RefAttributes } from "react";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
  
  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }

  type ElementType<P = any> = 
    | { [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never }[keyof JSX.IntrinsicElements] 
    | React.ComponentType<P>
    | React.ForwardRefExoticComponent<P & RefAttributes<any>>;

  interface ForwardRefExoticComponent<P> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }
}

interface TransactionDatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  selectedDate?: Date;
}

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

interface DialogProps {
  className?: string;
}

interface DialogContentProps {
  className?: string;
}

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

interface EditTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
  className?: string;
}

interface AddTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTransactionAdded: () => void;
  className?: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
  className?: string;
}

interface TransactionDetailsProps {
  transaction: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  className?: string;
}

interface TransactionControlsProps {
  onClose: () => void;
  onSave: () => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

interface TransactionFormLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface RecurringIndicatorProps {
  isRecurring: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isHovered: boolean;
  className?: string;
}

interface DeleteIndicatorProps {
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}
