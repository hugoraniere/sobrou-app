
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialPlanningService } from '@/services/FinancialPlanningService';
import { useTransactionList } from '@/hooks/useTransactionList';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';
import AlertSection from '@/components/financial-planning/AlertSection';
import FinancialMetrics from '@/components/financial-planning/FinancialMetrics';
import SimulationCard from '@/components/financial-planning/SimulationCard';

const FinancialPlanning = () => {
  const { t } = useTranslation();
  const [simulatedExpense, setSimulatedExpense] = useState('');
  const { transactionsState: transactions } = useTransactionList([]);
  
  const stats = FinancialPlanningService.calculateAvailableAmount(transactions, 0);

  const simulatedStats = simulatedExpense 
    ? FinancialPlanningService.calculateAvailableAmount(
        [...transactions, {
          id: 'simulated',
          type: 'expense',
          amount: parseCurrencyToNumber(simulatedExpense),
          date: new Date().toISOString(),
          description: 'Simulação',
          category: 'other',
          is_recurring: false,
          user_id: '',
          created_at: new Date().toISOString()
        }],
        0
      )
    : stats;

  const handleSimulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulatedExpense(formatCurrencyInput(e.target.value));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('financialPlanning.title', 'Planejamento Financeiro')}
      </h1>

      <AlertSection show={stats.hasRisk} />
      <FinancialMetrics stats={simulatedStats} />
      <SimulationCard 
        simulatedExpense={simulatedExpense}
        onSimulationChange={handleSimulationChange}
      />
    </div>
  );
};

export default FinancialPlanning;
