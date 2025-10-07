import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransactionService } from '@/services/transactions';
import { billsService } from '@/services/billsService';
import { MEISettingsService } from '@/services/meiSettingsService';
import type { Transaction } from '@/services/transactions/types';
import type { MEIDashboardData } from '@/types/mei';

export function useMEIDashboard() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Buscar transações do mês atual
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => TransactionService.getTransactions(),
  });

  // Buscar contas a pagar
  const { data: bills = [] } = useQuery({
    queryKey: ['bills'],
    queryFn: () => billsService.getBills(),
  });

  // Buscar configurações MEI
  const { data: meiSettings } = useQuery({
    queryKey: ['mei-settings'],
    queryFn: () => MEISettingsService.getOrCreateSettings(),
  });

  const dashboardData: MEIDashboardData = useMemo(() => {
    // Filtrar transações do mês atual
    const currentMonthTransactions = transactions.filter((t: Transaction) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() + 1 === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Calcular receita e custos
    const revenue = currentMonthTransactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const costs = currentMonthTransactions
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // Calcular impostos a reservar
    const taxPercentage = meiSettings?.tax_reserve_percentage || 6;
    const taxReserve = (revenue * taxPercentage) / 100;

    // Contas a pagar nos próximos 15 dias
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

    const upcomingBills = bills.filter((bill: any) => {
      if (bill.is_paid) return false;
      const dueDate = new Date(bill.due_date);
      return dueDate <= fifteenDaysFromNow && dueDate >= new Date();
    });

    const upcomingPayments = {
      count: upcomingBills.length,
      total: upcomingBills.reduce((sum: number, bill: any) => sum + bill.amount, 0),
    };

    // Progresso anual
    const currentYearTransactions = transactions.filter((t: Transaction) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear && t.type === 'income';
    });

    const annualRevenue = currentYearTransactions.reduce(
      (sum: number, t: Transaction) => sum + t.amount,
      0
    );

    const annualLimit = meiSettings?.annual_limit || 81000;
    const annualProgress = {
      current: annualRevenue,
      limit: annualLimit,
      percentage: (annualRevenue / annualLimit) * 100,
    };

    return {
      revenue,
      costs,
      profit,
      margin,
      taxReserve,
      upcomingPayments,
      annualProgress,
    };
  }, [transactions, bills, meiSettings, currentMonth, currentYear]);

  return {
    dashboardData,
    isLoading: !transactions || !meiSettings,
  };
}
