import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/services/transactions';

interface TransactionFilters {
  category: string;
  type: string;
  dateRange: string;
  minAmount: string;
  maxAmount: string;
}

export const useFilteredTransactions = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    category: '',
    type: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
  });

  // Handle updating individual filter values
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all filters to default values
  const handleResetFilters = () => {
    setFilters({
      category: '',
      type: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
    });
  };

  // Filter transactions based on current filter values
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by category
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      // Filter by type
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange && filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
        if (filters.dateRange === 'thisMonth') {
          if (
            transactionDate.getMonth() !== now.getMonth() ||
            transactionDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        } else if (filters.dateRange === 'lastMonth') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          
          if (
            transactionDate.getMonth() !== lastMonth ||
            transactionDate.getFullYear() !== lastMonthYear
          ) {
            return false;
          }
        } else if (filters.dateRange === 'thisYear') {
          if (transactionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      // Filter by min amount
      if (filters.minAmount && parseFloat(filters.minAmount) > transaction.amount) {
        return false;
      }

      // Filter by max amount
      if (filters.maxAmount && parseFloat(filters.maxAmount) < transaction.amount) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return {
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredTransactions
  };
};
