
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecurringTransactionsTable from './RecurringTransactionsTable';
import type { Transaction } from '@/types/component-types';

interface RecurringTransactionsSectionProps {
  transactions: Transaction[];
}

const RecurringTransactionsSection: React.FC<RecurringTransactionsSectionProps> = ({ 
  transactions 
}) => {
  const { t } = useTranslation();
  const recurringTransactions = transactions.filter(t => t.is_recurring);

  if (recurringTransactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('financialPlanning.recurringExpenses', 'Despesas Recorrentes')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RecurringTransactionsTable transactions={recurringTransactions} />
      </CardContent>
    </Card>
  );
};

export default RecurringTransactionsSection;
