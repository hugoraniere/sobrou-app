
import { useMemo } from 'react';
import { Bill, BillPeriodFilter } from '@/types/bills';
import { BillsPeriodFilter } from '@/components/bills/BillsFilterBar';
import { 
  isToday, 
  isTomorrow, 
  isThisWeek, 
  isThisMonth, 
  isPast, 
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval
} from 'date-fns';

interface BillFilters {
  searchTerm: string;
  periodFilter: BillsPeriodFilter;
  customMonth: string;
  hidePaid: boolean;
}

export const useBillFilters = (bills: Bill[], filters: BillFilters) => {
  const filteredBills = useMemo(() => {
    let filtered = bills;

    // Filtro por termo de busca
    if (filters.searchTerm.trim()) {
      filtered = filtered.filter(bill => 
        bill.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (bill.description && bill.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Filtro para ocultar contas pagas
    if (filters.hidePaid) {
      filtered = filtered.filter(bill => !bill.is_paid);
    }

    // Filtro por período
    switch (filters.periodFilter) {
      case 'today':
        filtered = filtered.filter(bill => 
          isToday(parseISO(bill.due_date))
        );
        break;
      case 'this-week':
        filtered = filtered.filter(bill => 
          isThisWeek(parseISO(bill.due_date), { weekStartsOn: 0 })
        );
        break;
      case 'this-month':
        filtered = filtered.filter(bill => 
          isThisMonth(parseISO(bill.due_date))
        );
        break;
      case 'custom-month':
        if (filters.customMonth) {
          const monthStart = startOfMonth(parseISO(`${filters.customMonth}-01`));
          const monthEnd = endOfMonth(parseISO(`${filters.customMonth}-01`));
          filtered = filtered.filter(bill => 
            isWithinInterval(parseISO(bill.due_date), { start: monthStart, end: monthEnd })
          );
        }
        break;
      case 'always':
        // Não filtra por período, mostra todas as contas
        break;
    }

    return filtered;
  }, [bills, filters]);

  const billMetrics = useMemo(() => {
    // Aplicar os mesmos filtros de período para as métricas
    let metricsFiltered = bills;
    
    switch (filters.periodFilter) {
      case 'today':
        metricsFiltered = metricsFiltered.filter(bill => 
          isToday(parseISO(bill.due_date))
        );
        break;
      case 'this-week':
        metricsFiltered = metricsFiltered.filter(bill => 
          isThisWeek(parseISO(bill.due_date), { weekStartsOn: 0 })
        );
        break;
      case 'this-month':
        metricsFiltered = metricsFiltered.filter(bill => 
          isThisMonth(parseISO(bill.due_date))
        );
        break;
      case 'custom-month':
        if (filters.customMonth) {
          const monthStart = startOfMonth(parseISO(`${filters.customMonth}-01`));
          const monthEnd = endOfMonth(parseISO(`${filters.customMonth}-01`));
          metricsFiltered = metricsFiltered.filter(bill => 
            isWithinInterval(parseISO(bill.due_date), { start: monthStart, end: monthEnd })
          );
        }
        break;
      case 'always':
        // Não filtra por período
        break;
    }

    const unpaidBills = metricsFiltered.filter(bill => !bill.is_paid);
    const paidBills = metricsFiltered.filter(bill => bill.is_paid);
    
    return {
      unpaidBillsCount: unpaidBills.length,
      paidBillsCount: paidBills.length,
      totalAmountToPay: unpaidBills.reduce((sum, bill) => sum + bill.amount, 0),
      totalAmountPaid: paidBills.reduce((sum, bill) => sum + bill.amount, 0),
    };
  }, [bills, filters.periodFilter, filters.customMonth]);

  return {
    filteredBills,
    billMetrics,
  };
};
