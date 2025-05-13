
import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/services/transactions';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isEqual, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TransactionFilter = 'all' | 'income' | 'expense' | 'transfer';

export const useModernTransactionList = (transactions: Transaction[]) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page number on filter/date change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentDate, selectedFilter]);

  // Formatar a data para exibição
  const formattedMonth = useMemo(() => {
    return format(currentDate, 'MMMM yyyy', { locale: ptBR });
  }, [currentDate]);

  // Verificar se há transações no próximo mês
  const hasTransactionsInNextMonth = useMemo(() => {
    const nextMonth = addMonths(currentDate, 1);
    const startOfNextMonth = startOfMonth(nextMonth);
    const endOfNextMonth = endOfMonth(nextMonth);
    
    return transactions.some(transaction => {
      const transactionDate = parseISO(transaction.date);
      return transactionDate >= startOfNextMonth && transactionDate <= endOfNextMonth;
    });
  }, [currentDate, transactions]);

  // Filtrar transações com base no mês atual e no filtro selecionado
  const filteredTransactions = useMemo(() => {
    console.log(`Filtrando ${transactions.length} transações, mês: ${formattedMonth}, filtro: ${selectedFilter}`);
    
    const startOfSelectedMonth = startOfMonth(currentDate);
    const endOfSelectedMonth = endOfMonth(currentDate);
    
    return transactions.filter(transaction => {
      try {
        // Filtrar por mês e ano
        const transactionDate = parseISO(transaction.date);
        const isInSelectedMonth = 
          transactionDate >= startOfSelectedMonth && 
          transactionDate <= endOfSelectedMonth;
          
        if (!isInSelectedMonth) return false;
        
        // Filtrar por tipo de transação 
        if (selectedFilter !== 'all' && transaction.type !== selectedFilter) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Erro ao processar data da transação:', transaction.date, error);
        return false;
      }
    }).sort((a, b) => {
      // Ordenar por data (mais recentes primeiro)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transactions, currentDate, selectedFilter]);

  // Implementar paginação
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  
  // Pegar apenas as transações da página atual
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    console.log(`Paginação: página ${currentPage}, inicio ${startIndex}, total ${filteredTransactions.length}`);
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Manipuladores de eventos
  const handleDateChange = (direction: 'next' | 'previous') => {
    setCurrentDate(currentDate => {
      return direction === 'next' 
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1);
    });
  };

  const handleFilterChange = (filter: TransactionFilter) => {
    setSelectedFilter(filter);
  };

  return {
    currentDate,
    formattedMonth,
    selectedFilter,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    currentPage,
    hasTransactionsInNextMonth,
    handleFilterChange,
    handleDateChange,
    setCurrentPage
  };
};
