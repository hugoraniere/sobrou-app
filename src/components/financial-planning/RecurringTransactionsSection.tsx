
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddTransactionDialog from '../transactions/AddTransactionDialog';
import RecurringTransactionsTable from './RecurringTransactionsTable';
import type { Transaction } from '@/types/component-types';

interface RecurringTransactionsSectionProps {
  transactions: Transaction[];
}

const RecurringTransactionsSection: React.FC<RecurringTransactionsSectionProps> = ({ 
  transactions 
}) => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const recurringTransactions = transactions.filter(t => t.is_recurring);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {t('financialPlanning.recurringExpenses', 'Despesas Recorrentes')}
        </CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="ml-2"
        >
          <Plus className="mr-2" />
          {t('transactions.addRecurring', 'Adicionar Recorrente')}
        </Button>
      </CardHeader>
      <CardContent>
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">
              {t('financialPlanning.noRecurringTransactions', 
                'Você ainda não tem despesas recorrentes cadastradas.')}
            </p>
            <p>
              {t('financialPlanning.addRecurringHint', 
                'Adicione suas despesas fixas como aluguel, streaming, academia, etc.')}
            </p>
          </div>
        ) : (
          <RecurringTransactionsTable transactions={recurringTransactions} />
        )}
      </CardContent>
      <AddTransactionDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </Card>
  );
};

export default RecurringTransactionsSection;

