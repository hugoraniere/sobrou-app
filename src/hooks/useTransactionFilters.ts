
import { useState } from 'react';

export interface TransactionFilters {
  category: string;
  type: string;
  dateRange: string;
  minAmount: string;
  maxAmount: string;
}

export const useTransactionFilters = (initialFilters: TransactionFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      type: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
    });
  };

  return {
    filters,
    handleFilterChange,
    handleResetFilters,
  };
};
