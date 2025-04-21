
import React from 'react';
import { Transaction } from '@/services/TransactionService';
import { FormLabel, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionAmountCell from '@/components/transactions/cells/TransactionAmountCell';
import TransactionTypeCell from '@/components/transactions/cells/TransactionTypeCell';
import TransactionCategoryCell from '@/components/transactions/cells/TransactionCategoryCell';
import { useTranslation } from 'react-i18next';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';

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

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TransactionTypeCell type={transaction.type} />
          <TransactionCategoryCell category={transaction.category} />
        </div>
      </div>

      <FormItem>
        <FormLabel>{t('transactions.amount', 'Valor')}</FormLabel>
        <FormControl>
          <Input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={onInputChange}
            placeholder="0.00"
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>{t('transactions.description', 'Descrição')}</FormLabel>
        <FormControl>
          <Input
            name="description"
            value={transaction.description}
            onChange={onInputChange}
            placeholder={t('transactions.descriptionPlaceholder', 'Ex: Supermercado')}
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>{t('transactions.category', 'Categoria')}</FormLabel>
        <FormControl>
          <CategorySelector
            value={transaction.category}
            onChange={(value) => handleSelectChange('category', value)}
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>{t('transactions.date', 'Data')}</FormLabel>
        <FormControl>
          <TransactionDatePicker
            date={new Date(transaction.date)}
            onDateChange={(date) => {
              if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                handleSelectChange('date', formattedDate);
              }
            }}
          />
        </FormControl>
      </FormItem>
    </div>
  );
};

export default TransactionDetails;
