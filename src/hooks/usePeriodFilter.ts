
import { useMemo } from 'react';
import { Transaction } from '@/services/transactions';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodOption = 'this-week' | 'this-month' | '6-months' | '1-year' | 'always';

interface PeriodFilter {
  startDate: Date | null;
  endDate: Date | null;
  label: string;
}

const getPeriodFilter = (period: PeriodOption): PeriodFilter => {
  const now = new Date();
  
  switch (period) {
    case 'this-week':
      return {
        startDate: startOfWeek(now, { locale: ptBR }),
        endDate: endOfWeek(now, { locale: ptBR }),
        label: 'Esta semana'
      };
    case 'this-month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: 'Este mês'
      };
    case '6-months':
      return {
        startDate: subMonths(now, 6),
        endDate: now,
        label: 'Últimos 6 meses'
      };
    case '1-year':
      return {
        startDate: subYears(now, 1),
        endDate: now,
        label: 'Último ano'
      };
    case 'always':
      return {
        startDate: null,
        endDate: null,
        label: 'Sempre'
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: 'Este mês'
      };
  }
};

export const usePeriodFilter = (transactions: Transaction[], period: PeriodOption) => {
  const filteredTransactions = useMemo(() => {
    const filter = getPeriodFilter(period);
    
    if (!filter.startDate || !filter.endDate) {
      return transactions;
    }
    
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= filter.startDate! && transactionDate <= filter.endDate!;
    });
  }, [transactions, period]);
  
  return {
    filteredTransactions,
    periodLabel: getPeriodFilter(period).label
  };
};

export const PERIOD_OPTIONS: Array<{ value: PeriodOption; label: string }> = [
  { value: 'this-week', label: 'Esta semana' },
  { value: 'this-month', label: 'Este mês' },
  { value: '6-months', label: 'Últimos 6 meses' },
  { value: '1-year', label: 'Último ano' },
  { value: 'always', label: 'Sempre' }
];
