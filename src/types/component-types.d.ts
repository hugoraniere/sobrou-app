
import React from 'react';

// Add missing className prop to components
declare module 'react' {
  interface IntrinsicAttributes {
    className?: string;
  }
}

// Add missing props for SavingGoals component
declare module '@/components/SavingGoals' {
  interface SavingGoalsProps {
    savingGoals: import('@/services/SavingsService').SavingGoal[];
    onGoalAdded: () => void;
    onGoalUpdated: () => void;
  }
}

// Add specific type declarations for components with className errors
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

// Add declarations for other components that need className
declare module '@/components/transactions/AddTransactionDialog' {
  interface AddTransactionDialogProps {
    className?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onTransactionAdded: () => void;
  }
}

declare module '@/components/transactions/EditTransactionDialog' {
  interface EditTransactionDialogProps {
    className?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    transaction: import('@/services/TransactionService').Transaction;
    onTransactionUpdated: () => void;
  }
}

declare module '@/components/transactions/TransactionRow' {
  interface TransactionRowProps {
    className?: string;
    transaction: import('@/services/TransactionService').Transaction;
    onEdit: (transaction: import('@/services/TransactionService').Transaction) => void;
    onDelete: (id: string) => void;
  }
}
