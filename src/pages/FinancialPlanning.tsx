
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialPlanningService } from '@/services/FinancialPlanningService';
import { useTransactionList } from '@/hooks/useTransactionList';
import AlertSection from '@/components/financial-planning/AlertSection';
import FinancialMetrics from '@/components/financial-planning/FinancialMetrics';
import ExpenseSimulationSection from '@/components/financial-planning/ExpenseSimulationSection';
import RecurringTransactionsSection from '@/components/financial-planning/RecurringTransactionsSection';
import { useExpenseSimulation } from '@/hooks/useExpenseSimulation';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const FinancialPlanning = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const { transactionsState: transactions } = useTransactionList([]);
  
  const stats = FinancialPlanningService.calculateAvailableAmount(transactions, 0);

  const {
    simulatedExpense,
    setSimulatedExpense,
    simulatedStats,
    calculateSimulation,
    clearSimulation
  } = useExpenseSimulation(transactions, stats);

  const hasNegativeBalance = simulatedStats
    ? simulatedStats.availableToday < 0 || 
      simulatedStats.availableThisWeek < 0 || 
      simulatedStats.availableThisMonth < 0
    : false;

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4" : "container mx-auto max-w-screen-xl"
    )}>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">
          {t('financialPlanning.title', 'Planejamento Financeiro')}
        </h1>
      </div>

      <div className="space-y-6">
        <AlertSection show={stats.hasRisk} />
        
        <FinancialMetrics 
          stats={stats}
          simulatedStats={simulatedStats}
        />
        
        <ExpenseSimulationSection
          simulatedExpense={simulatedExpense}
          onSimulationChange={setSimulatedExpense}
          onCalculate={calculateSimulation}
          onClear={clearSimulation}
          hasNegativeBalance={hasNegativeBalance}
        />

        <RecurringTransactionsSection transactions={transactions} />
      </div>
    </div>
  );
};

export default FinancialPlanning;
