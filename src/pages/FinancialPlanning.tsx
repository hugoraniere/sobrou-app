
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialPlanningService } from '@/services/FinancialPlanningService';
import { useTransactionList } from '@/hooks/useTransactionList';
import AlertSection from '@/components/financial-planning/AlertSection';
import FinancialMetrics from '@/components/financial-planning/FinancialMetrics';
import ExpenseSimulationSection from '@/components/financial-planning/ExpenseSimulationSection';
import { useExpenseSimulation } from '@/hooks/useExpenseSimulation';

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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('financialPlanning.title', 'Planejamento Financeiro')}
      </h1>

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
    </div>
  );
};

export default FinancialPlanning;
