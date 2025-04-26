
import React from 'react';
import { Transaction } from '@/types/component-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import RecurrenceControls from './RecurrenceControls';

interface TransactionDetailsProps {
  transaction: Partial<Transaction>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transaction, 
  onInputChange,
  handleSelectChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">{t('transactions.description', 'Descrição')}</Label>
        <Input
          id="description"
          name="description"
          value={transaction.description || ''}
          onChange={onInputChange}
          placeholder={t('transactions.descriptionPlaceholder', 'Ex: Supermercado')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">{t('transactions.amount', 'Valor')}</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            name="amount"
            value={transaction.amount || ''}
            onChange={onInputChange}
            placeholder="0.00"
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-gray-500">R$</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('transactions.category', 'Categoria')}</Label>
        <CategorySelector
          value={transaction.category || ''}
          onChange={(value) => handleSelectChange('category', value)}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('transactions.date', 'Data')}</Label>
        <TransactionDatePicker
          date={transaction.date ? new Date(transaction.date) : new Date()}
          onDateChange={(date) => {
            if (date) {
              const formattedDate = date.toISOString().split('T')[0];
              handleSelectChange('date', formattedDate);
            }
          }}
        />
      </div>

      <RecurrenceControls
        isRecurring={transaction.is_recurring || false}
        frequency={transaction.recurrence_frequency || 'monthly'}
        onIsRecurringChange={(value) => handleSelectChange('is_recurring', value.toString())}
        onFrequencyChange={(value) => handleSelectChange('recurrence_frequency', value)}
      />
    </div>
  );
};

export default TransactionDetails;
