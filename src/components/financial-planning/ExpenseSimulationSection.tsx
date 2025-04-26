
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { formatCurrencyInput } from '@/utils/currencyUtils';

interface ExpenseSimulationSectionProps {
  simulatedExpense: string;
  onSimulationChange: (value: string) => void;
  onCalculate: () => void;
  onClear: () => void;
  hasNegativeBalance: boolean;
}

const ExpenseSimulationSection: React.FC<ExpenseSimulationSectionProps> = ({
  simulatedExpense,
  onSimulationChange,
  onCalculate,
  onClear,
  hasNegativeBalance
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('financialPlanning.simulation', 'Simulação de Gasto')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full max-w-sm">
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={simulatedExpense}
                onChange={(e) => onSimulationChange(formatCurrencyInput(e.target.value))}
                className="text-right"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onCalculate}>
                {t('financialPlanning.calculate', 'Calcular impacto')}
              </Button>
              <Button variant="outline" onClick={onClear}>
                {t('financialPlanning.clear', 'Limpar simulação')}
              </Button>
            </div>
          </div>

          {hasNegativeBalance && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('financialPlanning.negativeBalanceWarning', 
                  'Com esse gasto, você ficaria com saldo negativo em algum período.')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSimulationSection;
