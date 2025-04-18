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
    | React.ForwardRefExoticComponent<P & RefAttributes<any>>
    | React.FunctionComponent<P>;

  interface ForwardRefExoticComponent<P> {
    (props: P & { children?: ReactNode; className?: string }): ReactElement | null;
  }
}

// Interfaces for Radix UI and other custom components

// AccordionItem
interface AccordionItemProps {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  disabled?: boolean;
}

// AccordionTrigger
interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

// AccordionContent
interface AccordionContentProps {
  className?: string;
  children?: React.ReactNode;
}

// AlertDialog
interface AlertDialogOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

interface AlertDialogContentProps {
  className?: string;
  children?: React.ReactNode;
}

interface AlertDialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

interface AlertDialogActionProps {
  className?: string;
  children?: React.ReactNode;
}

interface AlertDialogCancelProps {
  className?: string;
  children?: React.ReactNode;
}

// Avatar
interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
}

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
  delayMs?: number;
}

// Checkbox
interface CheckboxProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

// Command
interface CommandProps {
  className?: string;
  children?: React.ReactNode;
}

interface CommandInputProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface CommandListProps {
  className?: string;
  children?: React.ReactNode;
}

interface CommandEmptyProps {
  className?: string;
  children?: React.ReactNode;
}

interface CommandGroupProps {
  className?: string;
  heading?: React.ReactNode;
  children?: React.ReactNode;
}

interface CommandItemProps {
  className?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  value?: string;
  children?: React.ReactNode;
}

interface CommandSeparatorProps {
  className?: string;
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
  children?: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children?: React.ReactNode;
}

interface PopoverProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface PopoverTriggerProps {
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

interface PopoverContentProps {
  className?: string;
  align?: string;
  sideOffset?: number;
  children?: React.ReactNode;
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

// Outros tipos necessários para componentes UI
interface CommandSeparatorProps {
  className?: string;
}

interface CommandShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

interface SheetProps {
  className?: string;
  children?: React.ReactNode;
}

interface SheetContentProps {
  className?: string;
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

interface SheetHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

interface SheetFooterProps {
  className?: string;
  children?: React.ReactNode;
}

interface SheetTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface SheetDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

interface ToastProps {
  className?: string;
  children?: React.ReactNode;
}

interface ToastActionProps {
  className?: string;
  children?: React.ReactNode;
  altText: string;
}

interface ToastCloseProps {
  className?: string;
  children?: React.ReactNode;
}

interface ToastTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface ToastDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

interface ToastViewportProps {
  className?: string;
  children?: React.ReactNode;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}
