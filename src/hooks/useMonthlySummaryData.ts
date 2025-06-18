
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Transaction, TransactionService } from '@/services/transactions';
import { MonthlySummaryData, MonthData, CategoryTotal } from '@/types/monthly-summary';
import { classifyCategory, getCategoryDisplayName } from '@/data/monthlySummaryCategories';
import { format, startOfYear, endOfYear } from 'date-fns';

export const useMonthlySummaryData = (year: number) => {
  const startDate = format(startOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');
  const endDate = format(endOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['monthly-summary', year],
    queryFn: () => TransactionService.getTransactionsByDateRange(startDate, endDate),
  });

  const summaryData = useMemo((): MonthlySummaryData => {
    const monthsData: MonthData[] = [];

    // Inicializar dados para cada mês
    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month;
      });

      const revenue: CategoryTotal[] = [];
      const essentialExpenses: CategoryTotal[] = [];
      const nonEssentialExpenses: CategoryTotal[] = [];
      const monthlyReserves: CategoryTotal[] = [];

      // Agrupar transações por categoria
      const categoryGroups = new Map<string, Transaction[]>();
      
      monthTransactions.forEach(transaction => {
        const key = `${transaction.type}-${transaction.category}`;
        if (!categoryGroups.has(key)) {
          categoryGroups.set(key, []);
        }
        categoryGroups.get(key)!.push(transaction);
      });

      // Processar cada grupo de categoria
      categoryGroups.forEach((transactionGroup, key) => {
        const [type, category] = key.split('-');
        const amount = transactionGroup.reduce((sum, t) => sum + t.amount, 0);
        
        const categoryTotal: CategoryTotal = {
          category,
          displayName: getCategoryDisplayName(category),
          amount,
          transactions: transactionGroup
        };

        if (type === 'income') {
          revenue.push(categoryTotal);
        } else if (type === 'expense') {
          const classification = classifyCategory(category);
          if (classification === 'essential') {
            essentialExpenses.push(categoryTotal);
          } else if (classification === 'reserve') {
            monthlyReserves.push(categoryTotal);
          } else {
            nonEssentialExpenses.push(categoryTotal);
          }
        } else if (type === 'transfer' && classifyCategory(category) === 'reserve') {
          monthlyReserves.push(categoryTotal);
        }
      });

      // Calcular totais
      const totalRevenue = revenue.reduce((sum, cat) => sum + cat.amount, 0);
      const totalEssentialExpenses = essentialExpenses.reduce((sum, cat) => sum + cat.amount, 0);
      const totalNonEssentialExpenses = nonEssentialExpenses.reduce((sum, cat) => sum + cat.amount, 0);
      const totalReserves = monthlyReserves.reduce((sum, cat) => sum + cat.amount, 0);
      const monthlySurplus = totalRevenue - totalEssentialExpenses - totalNonEssentialExpenses - totalReserves;

      monthsData.push({
        month,
        revenue,
        essentialExpenses,
        nonEssentialExpenses,
        monthlyReserves,
        monthlySurplus,
        totalRevenue,
        totalEssentialExpenses,
        totalNonEssentialExpenses,
        totalReserves
      });
    }

    return {
      year,
      months: monthsData
    };
  }, [transactions, year]);

  return {
    data: summaryData,
    isLoading,
    error
  };
};
