import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Banknote, Smartphone, ArrowRightLeft, FileText, Wallet } from 'lucide-react';

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX', icon: Smartphone },
  { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { value: 'debito', label: 'Cartão Débito', icon: CreditCard },
  { value: 'credito', label: 'Cartão Crédito', icon: CreditCard },
  { value: 'transferencia', label: 'Transferência', icon: ArrowRightLeft },
  { value: 'boleto', label: 'Boleto', icon: FileText },
  { value: 'outros', label: 'Outros', icon: Wallet },
];

export const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a forma" />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <SelectItem key={method.value} value={method.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{method.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
