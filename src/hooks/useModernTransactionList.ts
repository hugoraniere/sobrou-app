
import { useState, useEffect } from 'react';
import { format, startOfToday, startOfMonth, subDays, startOfYear } from 'date-fns';
import { Transaction } from '@/services/transactions';

type QuickFilterType = 'today' | '7days' | 'thisMonth' | 'thisYear';

export const useModernTransactionList = (transactions: Transaction[]) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<QuickFilterType>('thisMonth');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Apply filters based on the selected quick filter or date
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    console.log(`Filtering ${transactions.length} transactions with filter: ${selectedFilter}`);
    
    let filtered = [...transactions];
    const today = startOfToday();
    
    // Apply quick filter
    switch (selectedFilter) {
      case 'today':
        filtered = filtered.filter(tx => 
          format(new Date(tx.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        break;
      case '7days':
        const sevenDaysAgo = subDays(today, 7);
        filtered = filtered.filter(tx => 
          new Date(tx.date) >= sevenDaysAgo
        );
        break;
      case 'thisMonth':
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(), 
          currentDate.getMonth() + 1, 
          0
        );
        
        filtered = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= firstDayOfMonth && txDate <= lastDayOfMonth;
        });
        break;
      case 'thisYear':
        const firstDayOfYear = startOfYear(currentDate);
        const lastDayOfYear = new Date(
          currentDate.getFullYear(), 
          11, 
          31
        );
        
        filtered = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= firstDayOfYear && txDate <= lastDayOfYear;
        });
        break;
      default:
        break;
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    console.log(`After filtering: ${filtered.length} transactions`);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactions, selectedFilter, currentDate]);
  
  // Check if there are transactions in the next month
  const hasTransactionsInNextMonth = transactions.some(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === (currentDate.getMonth() + 1) % 12;
  });
  
  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId as QuickFilterType);
  };
  
  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + itemsPerPage
  );
  
  return {
    currentDate,
    selectedFilter,
    filteredTransactions,
    paginatedTransactions,
    currentPage,
    itemsPerPage,
    totalPages,
    hasTransactionsInNextMonth,
    handleFilterChange,
    handleDateChange,
    setCurrentPage,
    setItemsPerPage
  };
};
