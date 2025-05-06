
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  selected?: boolean;
}

interface ExtractedTransactionsTableProps {
  transactions: ExtractedTransaction[];
  onToggleSelection: (index: number) => void;
}

export const ExtractedTransactionsTable: React.FC<ExtractedTransactionsTableProps> = ({ 
  transactions, 
  onToggleSelection 
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('transactions.noTransactionsExtracted', 'Nenhuma transação extraída')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[500px] border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>{t('transactions.date', 'Data')}</TableHead>
            <TableHead>{t('transactions.description', 'Descrição')}</TableHead>
            <TableHead>{t('transactions.category', 'Categoria')}</TableHead>
            <TableHead>{t('transactions.type', 'Tipo')}</TableHead>
            <TableHead className="text-right">{t('transactions.amount', 'Valor')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox 
                  checked={transaction.selected} 
                  onCheckedChange={() => onToggleSelection(index)}
                />
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
              <TableCell>
                {transaction.category ? (
                  <Badge variant="outline">{transaction.category}</Badge>
                ) : (
                  <Badge variant="outline">outros</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                  {transaction.type === 'income' 
                    ? t('transactions.income', 'Receita') 
                    : t('transactions.expense', 'Despesa')}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
