
import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/services/transactions';
import { isSameMonth, isSameYear, isWithinInterval, isFuture, parseISO, isValid, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

export const useModernTransactionList = (transactions: Transaction[]) => {
  // Estados para gerenciar filtros e paginação
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({ startDate: null, endDate: null });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Verificar se filtro por período está ativo
  const isPeriodFilterActive = !!periodFilter.startDate && !!periodFilter.endDate;
  
  // Formatar data para exibição
  const formatDateDisplay = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd MMM yyyy', { locale: ptBR });
  };

  // Filtrar transações pelos filtros aplicados
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    console.log(`Processando ${transactions.length} transações`);
    console.log(`Filtros ativos: ${isPeriodFilterActive ? 'Período personalizado' : 'Mês atual'}`);
    
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
    }
    
    // Aplicar filtro de período se estiver ativo
    if (isPeriodFilterActive) {
      filtered = filtered.filter(transaction => {
        const transDate = parseValidDate(transaction.date);
        if (!transDate) return false;
        
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
    // Por padrão, filtrar pelo mês atual
    else {
      filtered = filtered.filter(transaction => {
        const transDate = parseValidDate(transaction.date);
        if (!transDate) return false;
        
        return isSameMonth(transDate, currentMonth) && 
               isSameYear(transDate, currentMonth);
      });
    }
    
    // Ordenar por data, mais recentes primeiro
    filtered.sort((a, b) => {
      const dateA = parseValidDate(a.date) || new Date(0);
      const dateB = parseValidDate(b.date) || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset para primeira página quando os filtros mudam
  }, [transactions, currentMonth, periodFilter, searchTerm]);
  
  // Função auxiliar para converter string para Date com validação
  const parseValidDate = (date: string | Date): Date | null => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? dateObj : null;
    } catch (e) {
      console.error("Erro ao converter data:", e);
      return null;
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
  };
  
  // Limpar filtro por período
  const clearPeriodFilter = () => {
    setPeriodFilter({ startDate: null, endDate: null });
  };
  
  // Atualizar termo de busca
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };
  
  // Calcular paginação
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
    formatDateDisplay
  };
};
