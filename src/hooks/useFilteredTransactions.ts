
import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/services/TransactionService';

export const useFilteredTransactions = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState({
    dateRange: '30days',
    category: 'all',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      dateRange: '30days',
      category: 'all',
      type: 'all',
      minAmount: '',
      maxAmount: ''
    });
  };

  // Function to filter expenses based on active filters
  const getFilteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by category
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }
      
      // Filter by type
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      
      // Filter by amount range
      if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      
      if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
        return false;
      }
      
      // Filter by time range
      if (filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        
        switch (filters.dateRange) {
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
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [transactions, filters]);

  return {
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredTransactions: getFilteredTransactions
  };
};
