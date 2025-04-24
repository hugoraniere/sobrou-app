
import { useState, useMemo } from 'react';
import { Transaction } from '@/services/TransactionService';

export type SortConfig = {
  key: keyof Transaction | '';
  direction: 'asc' | 'desc';
};

export const useTransactionSorter = (initialSortKey: keyof Transaction = 'date', initialDirection: 'asc' | 'desc' = 'desc') => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: initialSortKey, 
    direction: initialDirection 
  });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTransactions = (transactions: Transaction[]) => {
    if (!sortConfig.key) return transactions;
    
    return [...transactions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return {
    sortConfig,
    handleSort,
    sortedTransactions
  };
};
