
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
          <FormLabel className="text-xs font-medium text-gray-700">
            {t('transactions.amount', 'Valor')}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                R$
              </span>
              <Input
                type="text"
                placeholder="0,00"
                className="pl-9 text-sm font-medium"
                {...field}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default CurrencyInput;
