
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
      if (sortConfig.key === 'date') {
        // Convert strings to Date objects for proper comparison
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        
        // First compare by date
        const dateDiff = dateA.getTime() - dateB.getTime();
        
        if (dateDiff === 0) {
          // If dates are equal, compare by created_at as secondary sort
          const createdAtA = new Date(a.created_at);
          const createdAtB = new Date(b.created_at);
          return sortConfig.direction === 'asc' 
            ? createdAtA.getTime() - createdAtB.getTime()
            : createdAtB.getTime() - createdAtA.getTime();
        }
        
        return sortConfig.direction === 'asc' ? dateDiff : -dateDiff;
      }
      
      // For non-date fields
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
