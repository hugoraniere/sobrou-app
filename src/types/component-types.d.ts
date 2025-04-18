
import React, { AriaAttributes, DOMAttributes, ForwardRefExoticComponent, ReactElement, ReactNode, RefAttributes } from "react";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    children?: ReactNode;
  }
  
  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    children?: ReactNode;
  }

  type ElementType<P = any> = 
    | { [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never }[keyof JSX.IntrinsicElements] 
    | React.ComponentType<P>
    | ForwardRefExoticComponent<P & RefAttributes<any>>;

  interface ForwardRefExoticComponent<P> {
    (props: P & { children?: ReactNode; className?: string }): ReactElement | null;
  }
}

// Interface padrão com className e children
interface StandardProps {
  className?: string;
  children?: React.ReactNode;
}

// Interfaces for Radix UI and other custom components

// AccordionItem
interface AccordionItemProps extends StandardProps {
  value?: string;
  disabled?: boolean;
}

// AccordionTrigger
interface AccordionTriggerProps extends StandardProps {}

// AccordionContent
interface AccordionContentProps extends StandardProps {}

// AlertDialog
interface AlertDialogOverlayProps extends StandardProps {}

interface AlertDialogContentProps extends StandardProps {}

interface AlertDialogTitleProps extends StandardProps {}

interface AlertDialogDescriptionProps extends StandardProps {}

interface AlertDialogActionProps extends StandardProps {}

interface AlertDialogCancelProps extends StandardProps {}

// Avatar
interface AvatarProps extends StandardProps {}

interface AvatarImageProps extends StandardProps {
  src?: string;
  alt?: string;
}

interface AvatarFallbackProps extends StandardProps {
  delayMs?: number;
}

// Checkbox
interface CheckboxProps extends StandardProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

// Command
interface CommandProps extends StandardProps {}

interface CommandInputProps extends StandardProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface CommandListProps extends StandardProps {}

interface CommandEmptyProps extends StandardProps {}

interface CommandGroupProps extends StandardProps {
  heading?: React.ReactNode;
}

interface CommandItemProps extends StandardProps {
  onSelect?: (value: string) => void;
  disabled?: boolean;
  value?: string;
}

interface CommandSeparatorProps extends StandardProps {}

interface TransactionDatePickerProps extends StandardProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  selectedDate?: Date;
}

interface CategorySelectorProps extends StandardProps {
  categoryId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategorySelect: (categoryId: string) => void;
  onReset: (e: React.MouseEvent) => void;
  userSelected: boolean;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

interface DialogProps extends StandardProps {}

interface DialogContentProps extends StandardProps {}

interface PopoverProps extends StandardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverTriggerProps extends StandardProps {
  asChild?: boolean;
}

interface PopoverContentProps extends StandardProps {
  align?: string;
  sideOffset?: number;
}

interface EditTransactionDialogProps extends StandardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
}

interface AddTransactionDialogProps extends StandardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTransactionAdded: () => void;
}

interface TransactionRowProps extends StandardProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}

interface TransactionDetailsProps extends StandardProps {
  transaction: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

interface TransactionControlsProps extends StandardProps {
  onClose: () => void;
  onSave: () => Promise<void>;
  isSubmitting?: boolean;
}

interface TransactionFormLayoutProps extends StandardProps {
  title: string;
  description: string;
  footer: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface RecurringIndicatorProps extends StandardProps {
  isRecurring: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isHovered: boolean;
}

interface DeleteIndicatorProps extends StandardProps {
  onDelete: (e: React.MouseEvent) => void;
}

// Outros tipos necessários para componentes UI
interface CommandShortcutProps extends StandardProps {}

interface SheetProps extends StandardProps {}

interface SheetContentProps extends StandardProps {
  side?: "top" | "right" | "bottom" | "left";
}

interface SheetHeaderProps extends StandardProps {}

interface SheetFooterProps extends StandardProps {}

interface SheetTitleProps extends StandardProps {}

interface SheetDescriptionProps extends StandardProps {}

interface ToastProps extends StandardProps {}

interface ToastActionProps extends StandardProps {
  altText: string;
}

interface ToastCloseProps extends StandardProps {}

interface ToastTitleProps extends StandardProps {}

interface ToastDescriptionProps extends StandardProps {}

interface ToastViewportProps extends StandardProps {}

interface ChatWindowProps extends StandardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FloatingChatButtonProps extends StandardProps {
  isOpen: boolean;
  onClick: () => void;
}
