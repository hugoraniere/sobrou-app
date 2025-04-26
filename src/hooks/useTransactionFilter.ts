import { useState, useMemo } from 'react';
import { Transaction } from '@/services/transactions';

interface FilterState {
  category: string;
  type: string;
  dateRange: string;
  minAmount: string;
  maxAmount: string;
  searchTerm: string;
  customDate?: string;
}

export const useTransactionFilter = (
  transactions: Transaction[],
  initialFilters: Partial<FilterState>
) => {
  const [filterState, setFilterState] = useState<FilterState>({
    category: initialFilters.category || 'all',
    type: initialFilters.type || 'all',
    dateRange: initialFilters.dateRange || '30days',
    minAmount: initialFilters.minAmount || '',
    maxAmount: initialFilters.maxAmount || '',
    searchTerm: '',
  });

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterState({
      category: 'all',
      type: 'all',
      dateRange: '30days',
      minAmount: '',
      maxAmount: '',
      searchTerm: '',
    });
  };

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by search term
      if (filterState.searchTerm) {
        const searchTermLower = filterState.searchTerm.toLowerCase();
        const matchesDescription = transaction.description.toLowerCase().includes(searchTermLower);
        const matchesAmount = transaction.amount.toString().includes(filterState.searchTerm);
        
        if (!matchesDescription && !matchesAmount) {
          return false;
        }
      }
      
      // Filter by category
      if (filterState.category !== 'all' && transaction.category !== filterState.category) {
        return false;
      }
      
      // Filter by type
      if (filterState.type !== 'all' && transaction.type !== filterState.type) {
        return false;
      }
      
      // Filter by amount range
      if (filterState.minAmount && transaction.amount < parseFloat(filterState.minAmount)) {
        return false;
      }
      
      if (filterState.maxAmount && transaction.amount > parseFloat(filterState.maxAmount)) {
        return false;
      }
      
      // Filter by date range
      if (filterState.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        
        switch (filterState.dateRange) {
          case '7days': {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          }
          case '30days': {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            return transactionDate >= monthAgo;
          }
          case 'thisMonth': {
            return (
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            );
          }
          case 'lastMonth': {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return (
              transactionDate.getMonth() === lastMonth.getMonth() &&
              transactionDate.getFullYear() === lastMonth.getFullYear()
            );
          }
          case 'thisYear': {
            return transactionDate.getFullYear() === today.getFullYear();
          }
          case 'custom': {
            if (filterState.customDate) {
              const filterDate = new Date(filterState.customDate);
              return (
                transactionDate.getDate() === filterDate.getDate() &&
                transactionDate.getMonth() === filterDate.getMonth() &&
                transactionDate.getFullYear() === filterDate.getFullYear()
              );
            }
          }
        }
      }
      
      return true;
    });
  }, [transactions, filterState]);

  return {
    filterState,
    filteredTransactions,
    handleFilterChange,
    handleResetFilters
  };
};
