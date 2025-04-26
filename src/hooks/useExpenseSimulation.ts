
import { useState } from 'react';
import { Transaction } from '@/types/component-types';
import { FinancialPlanningService, FinancialPlanningStats } from '@/services/FinancialPlanningService';
import { parseCurrencyToNumber } from '@/utils/currencyUtils';

export const useExpenseSimulation = (
  transactions: Transaction[],
  currentStats: FinancialPlanningStats
) => {
  const [simulatedExpense, setSimulatedExpense] = useState('');
  const [simulatedStats, setSimulatedStats] = useState<FinancialPlanningStats | null>(null);

  const calculateSimulation = () => {
    const expenseAmount = parseCurrencyToNumber(simulatedExpense);
    if (expenseAmount <= 0) {
      setSimulatedStats(null);
      return;
    }

    const simulatedTransaction: Transaction = {
      id: 'simulated',
      type: 'expense',
      amount: expenseAmount,
      date: new Date().toISOString(),
      description: 'Simulação',
      category: 'other',
      is_recurring: false,
      user_id: '',
      created_at: new Date().toISOString()
    };

    const stats = FinancialPlanningService.calculateAvailableAmount(
      [...transactions, simulatedTransaction],
      currentStats.savingsGoalAmount
    );

    setSimulatedStats(stats);
  };

  const clearSimulation = () => {
    setSimulatedExpense('');
    setSimulatedStats(null);
  };

  return {
    simulatedExpense,
    setSimulatedExpense,
    simulatedStats,
    calculateSimulation,
    clearSimulation
  };
};
