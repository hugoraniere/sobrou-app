
import React from 'react';

// Extend React's IntrinsicAttributes to include className globally
declare module 'react' {
  interface IntrinsicAttributes {
    className?: string;
  }
}

// Update existing type declarations to explicitly include className
declare module '@/components/prompt/CategorySelector' {
  interface CategorySelectorProps {
    categoryId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onCategorySelect: (categoryId: string) => void;
    onReset: (e: React.MouseEvent) => void;
    userSelected: boolean;
    className?: string;
  }
}

// Add className to AddTransactionDialog props
declare module '@/components/transactions/AddTransactionDialog' {
  interface AddTransactionDialogProps {
    className?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onTransactionAdded: () => void;
  }
}

// Add className to EditTransactionDialog props
declare module '@/components/transactions/EditTransactionDialog' {
  interface EditTransactionDialogProps {
    className?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    transaction: import('@/services/TransactionService').Transaction;
    onTransactionUpdated: () => void;
  }
}

// Add className to TransactionRow props
declare module '@/components/transactions/TransactionRow' {
  interface TransactionRowProps {
    transaction: import('@/services/TransactionService').Transaction;
    onToggleRecurring: (id: string, isRecurring: boolean) => void;
    formatDate: (dateString: string) => string;
    onTransactionUpdated: () => void;
    className?: string;
  }
}
