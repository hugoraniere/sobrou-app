
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/TransactionService';

export const useTransactionList = (
  transactions: Transaction[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions);
  
  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);

  const getPaginatedTransactions = (sortedFilteredTransactions: Transaction[]) => {
    const totalPages = Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      paginatedTransactions: sortedFilteredTransactions.slice(startIndex, startIndex + itemsPerPage),
      totalPages
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return {
    currentPage,
    setCurrentPage,
    transactionsState,
    setTransactionsState,
    getPaginatedTransactions,
    formatDate
  };
};
