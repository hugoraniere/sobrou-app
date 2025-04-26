
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BigNumberCard from '@/components/dashboard/BigNumberCard';
import { Input } from "@/components/ui/input";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FinancialPlanningService, FinancialPlanningStats } from '@/services/FinancialPlanningService';
import { Transaction } from '@/types/component-types';
import { useTransactionList } from '@/hooks/useTransactionList';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';

const FinancialPlanning = () => {
  const { t } = useTranslation();
  const [simulatedExpense, setSimulatedExpense] = useState('');
  const { transactionsState: transactions } = useTransactionList([]);
  
  const stats = FinancialPlanningService.calculateAvailableAmount(
    transactions,
    0 // TODO: Integrate with savings goals when available
  );

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

      {stats.hasRisk && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Suas despesas previstas superam sua receita mensal.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <BigNumberCard
          title={t('financialPlanning.availableToday', 'Disponível Hoje')}
          value={simulatedStats.availableToday}
          type={simulatedStats.availableToday < 0 ? 'negative' : 'positive'}
          tooltip={t('financialPlanning.dailyTooltip', 'Valor disponível para gastar hoje, considerando suas receitas e despesas')}
        />
        <BigNumberCard
          title={t('financialPlanning.availableWeek', 'Disponível na Semana')}
          value={simulatedStats.availableThisWeek}
          type={simulatedStats.availableThisWeek < 0 ? 'negative' : 'positive'}
          tooltip={t('financialPlanning.weeklyTooltip', 'Valor disponível para gastar esta semana')}
        />
        <BigNumberCard
          title={t('financialPlanning.availableMonth', 'Disponível no Mês')}
          value={simulatedStats.availableThisMonth}
          type={simulatedStats.availableThisMonth < 0 ? 'negative' : 'positive'}
          tooltip={t('financialPlanning.monthlyTooltip', 'Valor disponível para gastar este mês')}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('financialPlanning.simulation', 'Simulação de Gasto')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-sm">
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={simulatedExpense}
                onChange={handleSimulationChange}
                className="text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialPlanning;
