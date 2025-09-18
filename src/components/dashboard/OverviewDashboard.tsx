
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import IncomeByTypeChart from '../charts/IncomeByTypeChart';
import WeeklySpendingTrendChart from '../charts/WeeklySpendingTrendChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import FinancialGoalsProgress from '../charts/FinancialGoalsProgress';
import DashboardOverviewCard from './DashboardOverviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionCategories } from '@/data/categories';
import { TEXT } from '@/constants/text';
import { DASHBOARD_TEXT } from '@/constants/text/dashboard';
import EmptyStateMessage from './EmptyStateMessage';
import RecentTransactions from './RecentTransactions';
import { CATEGORY_COLORS } from '@/constants/categoryColors';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useBillsData } from '@/hooks/useBillsData';
import { format, isAfter, isBefore, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, CreditCard } from 'lucide-react';
import DashboardInsights from './tabs/DashboardInsights';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  savingGoals
}) => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const { bills, isLoading: billsLoading } = useBillsData();
  
  // Inicializa filteredTransactions com todas as transações
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  
  // Atualiza quando transactions mudar
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);
  
  const hasTransactions = filteredTransactions.length > 0;
  const hasSavingGoals = savingGoals.length > 0;

  // Calculate total savings from savings goals
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.current_amount, 0);

  // Default chart config with consistent colors
  const chartConfig = {
    income: {
      label: TEXT.common.income,
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    expense: {
      label: TEXT.common.expense,
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    },
    balance: {
      label: TEXT.common.balance,
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    },
    savings: {
      label: TEXT.common.savings,
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6"
      }
    }
  };

  // Add category colors from our new color tokens
  transactions.forEach(transaction => {
    const categoryId = transaction.category;
    if (!chartConfig[categoryId]) {
      // Use our new color tokens
      const categoryColor = CATEGORY_COLORS[categoryId as keyof typeof CATEGORY_COLORS] || "#CFCFCF";
      chartConfig[categoryId] = {
        label: transactionCategories.find(cat => cat.id === categoryId)?.name || categoryId,
        theme: {
          light: categoryColor,
          dark: categoryColor
        }
      };
    }
  });

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  const handleNavigateToGoals = () => {
    navigate('/goals');
  };

  const handleNavigateToBills = () => {
    navigate('/bills-to-pay');
  };

  // Calculate bills summary
  const billsSummary = React.useMemo(() => {
    if (!bills.length) return null;

    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const next7Days = addDays(now, 7);

    const unpaidBills = bills.filter(bill => !bill.is_paid);
    
    // Bills in this month
    const thisMonthBills = unpaidBills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate >= startOfThisMonth && dueDate <= endOfThisMonth;
    });

    // Overdue bills
    const overdueBills = unpaidBills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return isBefore(dueDate, now);
    });

    // Bills in next 7 days
    const upcoming7Days = unpaidBills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate >= now && dueDate <= next7Days;
    });

    const thisMonthTotal = thisMonthBills.reduce((sum, bill) => sum + bill.amount, 0);
    const overdueTotal = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);
    const upcoming7DaysTotal = upcoming7Days.reduce((sum, bill) => sum + bill.amount, 0);

    return {
      thisMonth: { count: thisMonthBills.length, total: thisMonthTotal },
      overdue: { count: overdueBills.length, total: overdueTotal },
      upcoming7Days: { count: upcoming7Days.length, total: upcoming7DaysTotal }
    };
  }, [bills]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Card de Visão Geral com Big Numbers - ocupa toda a largura */}
      <DashboardOverviewCard transactions={transactions} totalSavings={totalSavings} />

      {/* Grid responsivo */}
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      )}>
        {/* Transações Recentes */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Últimas transações</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllTransactions}
            >
              Ver todas
            </Button>
          </CardHeader>
          <CardContent className={cn(
            "overflow-y-auto",
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <RecentTransactions transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Gastos por Categoria */}
        <Card className="w-full" data-tour="category-chart">
          <CardHeader>
            <CardTitle className="text-xl">Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <ExpensesByCategoryChart expenses={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Receitas vs Despesas */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Receita vs Despesa</CardTitle>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "h-[320px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <RevenueVsExpenseChart transactions={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
          
        {/* Tendência de Gastos por Dia da Semana */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{DASHBOARD_TEXT.charts.weeklySpendingTrend}</CardTitle>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "h-[320px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <WeeklySpendingTrendChart transactions={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>


        {/* Fontes de Receita */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.incomeByType}</CardTitle>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <IncomeByTypeChart incomes={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Metas Financeiras */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">{TEXT.dashboard.charts.financialGoals}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNavigateToGoals}
            >
              Ir para Metas
            </Button>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {hasSavingGoals ? (
              <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noGoals} />
            )}
          </CardContent>
        </Card>

        {/* Contas a Pagar */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Contas a Pagar
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNavigateToBills}
            >
              Ir para Contas
            </Button>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {billsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : billsSummary ? (
              <div className="space-y-4">
                {/* Summary Section - Smaller boxes side by side */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-center">
                    <h3 className="font-medium text-blue-900 mb-0.5 text-xs">Este mês</h3>
                    <p className="text-sm font-bold text-blue-700">
                      R$ {billsSummary.thisMonth.total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-blue-600">
                      {billsSummary.thisMonth.count} {billsSummary.thisMonth.count === 1 ? 'conta' : 'contas'}
                    </p>
                  </div>

                  {billsSummary.overdue.count > 0 ? (
                    <div className="p-2 bg-red-50 rounded-lg text-center">
                      <h3 className="font-medium text-red-900 mb-0.5 text-xs">Vencidas</h3>
                      <p className="text-sm font-bold text-red-700">
                        {billsSummary.overdue.count}
                      </p>
                      <p className="text-xs text-red-600">
                        R$ {billsSummary.overdue.total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 bg-green-50 rounded-lg text-center">
                      <h3 className="font-medium text-green-900 mb-0.5 text-xs">Vencidas</h3>
                      <p className="text-sm font-bold text-green-700">0</p>
                      <p className="text-xs text-green-600">Em dia</p>
                    </div>
                  )}

                  {billsSummary.upcoming7Days.count > 0 ? (
                    <div className="p-2 bg-yellow-50 rounded-lg text-center">
                      <h3 className="font-medium text-yellow-900 mb-0.5 text-xs">7 dias</h3>
                      <p className="text-sm font-bold text-yellow-700">
                        {billsSummary.upcoming7Days.count}
                      </p>
                      <p className="text-xs text-yellow-600">
                        R$ {billsSummary.upcoming7Days.total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <h3 className="font-medium text-gray-700 mb-0.5 text-xs">7 dias</h3>
                      <p className="text-sm font-bold text-gray-600">0</p>
                      <p className="text-xs text-gray-500">-</p>
                    </div>
                  )}
                </div>

                {/* Individual Bills List - More space */}
                {bills.filter(bill => !bill.is_paid).length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-3 text-gray-700">Suas contas</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {bills
                        .filter(bill => !bill.is_paid)
                        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                        .slice(0, 5)
                        .map(bill => {
                          const dueDate = new Date(bill.due_date);
                          const isOverdue = isBefore(dueDate, new Date());
                          const isUpcoming = dueDate <= addDays(new Date(), 7) && dueDate >= new Date();
                          
                          return (
                            <div key={bill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{bill.title}</p>
                                <p className="text-gray-600 text-xs">
                                  {format(dueDate, "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="font-semibold">
                                  R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                {isOverdue && (
                                  <span className="inline-block px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                                    Vencida
                                  </span>
                                )}
                                {isUpcoming && !isOverdue && (
                                  <span className="inline-block px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                                    Em breve
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {bills.filter(bill => !bill.is_paid).length > 5 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{bills.filter(bill => !bill.is_paid).length - 5} contas adicionais
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {billsSummary.thisMonth.count === 0 && billsSummary.overdue.count === 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Tudo em dia!</h3>
                    <p className="text-sm text-green-600">
                      Não há contas pendentes neste período.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <EmptyStateMessage message="Nenhuma conta cadastrada" />
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Insights</CardTitle>
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "min-h-[300px]" : "h-[400px]"
          )}>
            {hasTransactions ? (
              <DashboardInsights transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
