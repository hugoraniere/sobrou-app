
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BillTransaction } from '@/types/billTransactions';
import { formatCurrency } from '@/lib/utils';

interface TransactionsListProps {
  transactions: BillTransaction[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onDelete,
  isDeleting = false,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma transação registrada</p>
        <p className="text-sm">Adicione pagamentos ou acréscimos para acompanhar o saldo</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-full ${
              transaction.type === 'debit' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-green-100 text-green-600'
            }`}>
              {transaction.type === 'debit' ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium ${
                  transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'debit' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
                <Badge variant={transaction.type === 'debit' ? 'destructive' : 'secondary'}>
                  {transaction.type === 'debit' ? 'Pagamento' : 'Acréscimo'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 truncate">{transaction.description}</p>
              
              <p className="text-xs text-gray-500">
                {format(new Date(transaction.transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
