
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrencyInput } from '@/utils/currencyUtils';

interface SimulationCardProps {
  simulatedExpense: string;
  onSimulationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SimulationCard: React.FC<SimulationCardProps> = ({
  simulatedExpense,
  onSimulationChange,
}) => {
  const { t } = useTranslation();

  return (
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
              onChange={onSimulationChange}
              className="text-right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationCard;
