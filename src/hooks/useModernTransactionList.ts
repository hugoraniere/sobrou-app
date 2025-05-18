
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
  
  // Filtrar transações pelos filtros aplicados
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    console.log(`Processando ${transactions.length} transações`);
    
    // Log das primeiras transações para debug
    console.log("Primeiras 3 transações para debug:");
    transactions.slice(0, 3).forEach((t, i) => {
      console.log(`Trans ${i}: id=${t.id}, data=${t.date}, tipo=${typeof t.date}`);
    });
    
    let filtered = [...transactions];
    
    // Aplicar filtro de período se estiver ativo
    if (periodFilter.startDate && periodFilter.endDate) {
      console.log(`Filtrando por período: ${periodFilter.startDate.toISOString()} até ${periodFilter.endDate.toISOString()}`);
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
    // Ou aplicar filtro de mês atual se não houver filtro de período
    else {
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
    
    // Sort by date, newest first
    filtered.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`Após processamento: ${filtered.length} transações`);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactions, currentMonth, periodFilter]);
  
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
  };
  
  // Limpar filtro por período
  const clearPeriodFilter = () => {
    setPeriodFilter({ startDate: null, endDate: null });
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
    isPeriodFilterActive
  };
};
