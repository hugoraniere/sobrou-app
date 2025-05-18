
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';

export const useModernTransactionList = (transactions: Transaction[]) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Mostrar todas as transações sem filtro
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    console.log(`Processando ${transactions.length} transações`);
    
    let filtered = [...transactions];
    
    // Sort by date, newest first
    filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    console.log(`Após processamento: ${filtered.length} transações`);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactions]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + itemsPerPage
  );
  
  return {
    filteredTransactions,
    paginatedTransactions,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage
  };
};
