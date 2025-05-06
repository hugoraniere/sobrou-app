
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';

export const useTransactionList = (
  transactions: Transaction[],
  defaultItemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions);
  
  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);
  
  useEffect(() => {
    // Reset to first page when items per page changes
    setCurrentPage(1);
  }, [itemsPerPage]);

  const getPaginatedTransactions = (sortedFilteredTransactions: Transaction[]) => {
    const totalPages = Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      paginatedTransactions: sortedFilteredTransactions.slice(startIndex, startIndex + itemsPerPage),
      totalPages,
      totalItems: sortedFilteredTransactions.length
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    transactionsState,
    setTransactionsState,
    getPaginatedTransactions,
    formatDate
  };
};
