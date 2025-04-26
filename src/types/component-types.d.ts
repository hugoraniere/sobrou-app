
import React from 'react';
import { Transaction } from '@/services/transactions';

export interface StandardProps {
  className?: string;
}

export interface CategorySelectorProps extends StandardProps {
  categoryId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategorySelect: (categoryId: string) => void;
  onReset: (e: React.MouseEvent) => void;
  userSelected: boolean;
}

// Re-export Transaction type
export type { Transaction };

export interface TransactionDetailsProps extends StandardProps {
  transaction: Transaction | Partial<Transaction>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export interface TransactionRowProps extends StandardProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}
