
import React from 'react';

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

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  amount: number;
  is_recurring?: boolean;
  user_id: string;
  created_at: string;
  recurrence_interval?: 'weekly' | 'monthly' | 'yearly';
}

export interface TransactionDetailsProps extends StandardProps {
  transaction: Transaction | Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export interface TransactionRowProps extends StandardProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}
