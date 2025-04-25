
import React from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput } from '@/utils/currencyUtils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';

interface CurrencyInputProps {
  name: string;
  control: any;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ name, control }) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('transactions.amount', 'Valor')}</FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <Input
                type="text"
                placeholder="0,00"
                className="pl-9"
                {...field}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CurrencyInput;
