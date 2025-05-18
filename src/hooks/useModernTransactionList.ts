
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { isSameMonth, isSameYear, isWithinInterval, isFuture, parseISO, isValid } from 'date-fns';

export type PeriodFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

export const useModernTransactionList = (transactions: Transaction[]) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({ startDate: null, endDate: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTransactions, setShowAllTransactions] = useState(true); // Mostrar todas por padrão
  
  // Filtrar transações pelos filtros aplicados
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    console.log(`Processando ${transactions.length} transações`);
    console.log(`Filtros ativos: ${isPeriodFilterActive ? 'Período personalizado' : (showAllTransactions ? 'Todas as transações' : 'Mês atual')}`);
    
    // Log das primeiras transações para debug
    console.log("Primeiras 3 transações para debug:");
    transactions.slice(0, 3).forEach((t, i) => {
      console.log(`Trans ${i}: id=${t.id}, data=${t.date}, tipo=${typeof t.date}`);
    });
    
    let filtered = [...transactions];
    
    // Aplicar filtro de texto se existir
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => {
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(searchTerm)
        );
      });
      console.log(`Após filtro de texto "${searchTerm}": ${filtered.length} transações`);
    }
    
    // Aplicar filtro de período se estiver ativo
    if (isPeriodFilterActive) {
      console.log(`Filtrando por período: ${periodFilter.startDate?.toISOString()} até ${periodFilter.endDate?.toISOString()}`);
      filtered = filtered.filter(transaction => {
        // Garantir que a data da transação é uma data válida
        const transDate = typeof transaction.date === 'string' 
          ? parseISO(transaction.date) 
          : new Date(transaction.date);
          
        if (!isValid(transDate)) {
          console.error(`Data inválida para transação ${transaction.id}: ${transaction.date}`);
          return false;
        }
        
        try {
          return isWithinInterval(transDate, {
            start: periodFilter.startDate as Date,
            end: periodFilter.endDate as Date
          });
        } catch (error) {
          console.error(`Erro ao filtrar transação ${transaction.id}:`, error);
          return false;
        }
      });
    } 
    // Ou aplicar filtro de mês atual se não estiver mostrando todas as transações
    else if (!showAllTransactions) {
      console.log(`Filtrando pelo mês: ${currentMonth.toISOString()}`);
      filtered = filtered.filter(transaction => {
        // Garantir que a data da transação é uma data válida
        const transDate = typeof transaction.date === 'string' 
          ? parseISO(transaction.date) 
          : new Date(transaction.date);
          
        if (!isValid(transDate)) {
          console.error(`Data inválida para transação ${transaction.id}: ${transaction.date}`);
          return false;
        }
        
        return isSameMonth(transDate, currentMonth) && 
               isSameYear(transDate, currentMonth);
      });
    }
    // Caso contrário, mantém todas as transações (showAllTransactions = true)
    
    // Sort by date, newest first
    filtered.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`Após processamento final: ${filtered.length} transações para exibir`);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactions, currentMonth, periodFilter, searchTerm, showAllTransactions]);
  
  // Alternar entre mostrar todas as transações ou apenas do mês atual
  const toggleShowAllTransactions = (show: boolean) => {
    setShowAllTransactions(show);
    if (show) {
      // Se estiver mostrando todas, limpa o filtro de período também
      clearPeriodFilter();
    }
  };

  // Aplicar filtro por período com validação de data futura
  const applyPeriodFilter = (startDate: Date, endDate: Date) => {
    // Não permitir datas futuras
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Final do dia atual
    
    const validEndDate = isFuture(endDate) ? today : endDate;
    
    setPeriodFilter({ 
      startDate, 
      endDate: validEndDate 
    });
    
    // Ao aplicar filtro de período, desativa o modo de exibir todas as transações
    setShowAllTransactions(false);
  };
  
  // Limpar filtro por período
  const clearPeriodFilter = () => {
    setPeriodFilter({ startDate: null, endDate: null });
  };
  
  // Atualizar termo de busca
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };
  
  // Verificar se filtro por período está ativo
  const isPeriodFilterActive = !!periodFilter.startDate && !!periodFilter.endDate;
  
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
    currentMonth,
    setCurrentMonth,
    setCurrentPage,
    setItemsPerPage,
    periodFilter,
    applyPeriodFilter,
    clearPeriodFilter,
    isPeriodFilterActive,
    searchTerm,
    updateSearchTerm,
    showAllTransactions,
    toggleShowAllTransactions
  };
};
