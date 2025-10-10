import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/utils';
import { CreditCard } from 'lucide-react';

interface InstallmentFormProps {
  totalAmount: number;
  onInstallmentChange: (isInstallment: boolean, installmentTotal?: number) => void;
}

export const InstallmentForm: React.FC<InstallmentFormProps> = ({
  totalAmount,
  onInstallmentChange,
}) => {
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentTotal, setInstallmentTotal] = useState(12);

  const installmentValue = totalAmount / installmentTotal;

  const handleToggle = (checked: boolean) => {
    setIsInstallment(checked);
    onInstallmentChange(checked, checked ? installmentTotal : undefined);
  };

  const handleInstallmentTotalChange = (value: number) => {
    const clamped = Math.max(2, Math.min(60, value));
    setInstallmentTotal(clamped);
    if (isInstallment) {
      onInstallmentChange(true, clamped);
    }
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-600" />
          <Label htmlFor="installment-toggle" className="text-sm font-medium">
            Parcelar esta conta?
          </Label>
        </div>
        <Switch
          id="installment-toggle"
          checked={isInstallment}
          onCheckedChange={handleToggle}
        />
      </div>

      {isInstallment && (
        <div className="space-y-3 pt-2">
          <div>
            <Label htmlFor="installment-count" className="text-sm">
              Número de parcelas
            </Label>
            <Input
              id="installment-count"
              type="number"
              min={2}
              max={60}
              value={installmentTotal}
              onChange={(e) => handleInstallmentTotalChange(parseInt(e.target.value) || 2)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo: 2 parcelas | Máximo: 60 parcelas
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Preview:</div>
            <div className="text-lg font-semibold text-gray-900">
              {installmentTotal}× de {formatCurrency(installmentValue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Total: {formatCurrency(totalAmount)}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Serão criadas {installmentTotal} contas separadas, 
              uma para cada mês. Cada uma poderá ser paga individualmente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
