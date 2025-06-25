
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialPlanningService } from '@/services/FinancialPlanningService';
import { useTransactionList } from '@/hooks/useTransactionList';
import AlertSection from '@/components/financial-planning/AlertSection';
import FinancialMetrics from '@/components/financial-planning/FinancialMetrics';
import ExpenseSimulationSection from '@/components/financial-planning/ExpenseSimulationSection';
import RecurringTransactionsSection from '@/components/financial-planning/RecurringTransactionsSection';
import { useExpenseSimulation } from '@/hooks/useExpenseSimulation';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const FinancialPlanning = () => {
  const { t } = useTranslation();
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
    <ResponsivePageContainer>
      <ResponsivePageHeader 
        title={t('financialPlanning.title', 'Planejamento Financeiro')}
      />

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
    </ResponsivePageContainer>
  );
};

export default FinancialPlanning;
