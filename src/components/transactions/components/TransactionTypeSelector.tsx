
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransactionTypeSelectorProps {
  value: string;
  onValueChange: (value: 'income' | 'expense') => void;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({ 
  value, 
  onValueChange 
}) => {
  const { t } = useTranslation();

  return (
    <Tabs 
      value={value} 
      onValueChange={(value) => onValueChange(value as 'income' | 'expense')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="expense">
          {t('transactions.expense', 'Despesa')}
        </TabsTrigger>
        <TabsTrigger value="income">
          {t('transactions.income', 'Receita')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TransactionTypeSelector;
