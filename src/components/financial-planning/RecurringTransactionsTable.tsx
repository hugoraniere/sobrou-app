
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types/component-types';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';

interface RecurringTransactionsTableProps {
  transactions: Transaction[];
}

const RecurringTransactionsTable: React.FC<RecurringTransactionsTableProps> = ({
  transactions
}) => {
  const { t } = useTranslation();
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter();

  const getRecurrenceLabel = (frequency?: string) => {
    switch (frequency) {
      case 'daily':
        return t('common.daily', 'Diária');
      case 'weekly':
        return t('common.weekly', 'Semanal');
      case 'yearly':
        return t('common.yearly', 'Anual');
      case 'monthly':
      default:
        return t('common.monthly', 'Mensal');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getTransactionStatus = (transaction: Transaction) => {
    const today = new Date();
    const nextDueDate = transaction.next_due_date ? new Date(transaction.next_due_date) : null;
    
    if (!nextDueDate) return 'future';
    return nextDueDate <= today ? 'confirmed' : 'future';
  };

  const sortedRecurringTransactions = sortedTransactions(transactions);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.description', 'Descrição')}</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              {t('common.amount', 'Valor')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('recurrence_frequency')}
            >
              {t('common.frequency', 'Frequência')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('next_due_date')}
            >
              {t('common.nextDueDate', 'Próxima Cobrança')}
            </TableHead>
            <TableHead>{t('common.status', 'Status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecurringTransactions.map((transaction) => {
            const status = getTransactionStatus(transaction);
            return (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  {getRecurrenceLabel(transaction.recurrence_frequency)}
                </TableCell>
                <TableCell>
                  {transaction.next_due_date ? (
                    format(new Date(transaction.next_due_date), 'dd/MM/yyyy', { locale: ptBR })
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={status === 'confirmed' ? 'default' : 'secondary'}
                    className={cn(
                      'capitalize',
                      status === 'confirmed' ? 'bg-green-500' : ''
                    )}
                  >
                    {status === 'confirmed' 
                      ? t('common.confirmed', 'Confirmado')
                      : t('common.future', 'Futuro')
                    }
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecurringTransactionsTable;

