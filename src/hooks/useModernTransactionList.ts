
import { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { format, parseISO, isValid, getMonth, getYear } from 'date-fns';

export function useModernTransactionList(transactions: Transaction[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  
  // Inverta a ordem das transações para mostrar as mais recentes primeiro
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateA !== dateB) {
        return dateB - dateA; // Ordem decrescente por data
      }
      
      // Se as datas forem iguais, ordenar pelo ID (mais recente primeiro)
      // Assumindo que IDs mais recentes têm valores maiores
      return b.id.localeCompare(a.id);
    });
  }, [transactions]);
  
  // Lista de meses disponíveis nas transações
  const availableMonths = useMemo(() => {
    const months: { [key: string]: boolean } = {};
    
    sortedTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (isValid(date)) {
        const year = getYear(date);
        const month = getMonth(date) + 1; // 0-indexed to 1-indexed
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        months[key] = true;
      }
    });
    
    return Object.keys(months).sort((a, b) => b.localeCompare(a)); // Mais recente primeiro
  }, [sortedTransactions]);
  
  // Filtrando transações com base no mês atual e termo de pesquisa
  const filteredTransactions = useMemo(() => {
    let filtered = [...sortedTransactions];
    
    // Filtrar por mês se não for 'all'
    if (currentMonth !== 'all') {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthNum = now.getMonth();
      
      filtered = filtered.filter(transaction => {
        const date = new Date(transaction.date);
        
        if (currentMonth === 'current') {
          return date.getMonth() === currentMonthNum && date.getFullYear() === currentYear;
        } else if (currentMonth === 'previous') {
          const prevMonth = currentMonthNum === 0 ? 11 : currentMonthNum - 1;
          const prevMonthYear = currentMonthNum === 0 ? currentYear - 1 : currentYear;
          return date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear;
        } else {
          // Formato: 'YYYY-MM'
          const [year, month] = currentMonth.split('-').map(Number);
          return date.getMonth() === month - 1 && date.getFullYear() === year;
        }
      });
    }
    
    // Filtrar por termo de pesquisa se não estiver vazio
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(term) || 
        transaction.category.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [sortedTransactions, currentMonth, searchTerm]);
  
  // Paginação
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);
  
  // Calculando o total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  
  // Resetar para a primeira página quando os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [currentMonth, searchTerm]);
  
  // Função para atualizar o termo de pesquisa
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };
  
  return {
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    currentPage,
    currentMonth,
    availableMonths,
    setCurrentPage,
    setCurrentMonth,
    searchTerm,
    updateSearchTerm
  };
}
