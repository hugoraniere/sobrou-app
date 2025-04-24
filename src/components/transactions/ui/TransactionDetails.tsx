
import React from 'react';
import { Transaction } from '@/services/TransactionService';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionAmountCell from '@/components/transactions/cells/TransactionAmountCell';
import TransactionTypeCell from '@/components/transactions/cells/TransactionTypeCell';
import TransactionCategoryCell from '@/components/transactions/cells/TransactionCategoryCell';
import { useTranslation } from 'react-i18next';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import { Label } from '@/components/ui/label';

interface TransactionDetailsProps {
  transaction: Transaction;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transaction, 
  onInputChange,
  handleSelectChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={transaction.type} 
        value={transaction.type}
        onValueChange={(value) => handleSelectChange('type', value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">{t('transactions.expense', 'Despesa')}</TabsTrigger>
          <TabsTrigger value="income">{t('transactions.income', 'Receita')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="amount">{t('transactions.amount', 'Valor')}</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            name="amount"
            value={transaction.amount}
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
        <Label htmlFor="description">{t('transactions.description', 'Descrição')}</Label>
        <Input
          id="description"
          name="description"
          value={transaction.description}
          onChange={onInputChange}
          placeholder={t('transactions.descriptionPlaceholder', 'Ex: Supermercado')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t('transactions.category', 'Categoria')}</Label>
        <CategorySelector
          value={transaction.category}
          onChange={(value) => handleSelectChange('category', value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">{t('transactions.date', 'Data')}</Label>
        <TransactionDatePicker
          date={new Date(transaction.date)}
          onDateChange={(date) => {
            if (date) {
              const formattedDate = date.toISOString().split('T')[0];
              handleSelectChange('date', formattedDate);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TransactionDetails;
