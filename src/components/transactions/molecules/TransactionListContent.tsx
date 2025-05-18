
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Card } from '@/components/ui/card';
import TransactionItem from './TransactionItem';

interface TransactionListContentProps {
  transactions: Transaction[];
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (id: string) => void;
  isEmpty?: boolean;
}

const TransactionListContent: React.FC<TransactionListContentProps> = ({
  transactions,
  onTransactionEdit,
  onTransactionDelete,
  isEmpty = false
}) => {
  if (isEmpty) {
    return (
      <Card className="flex flex-col items-center justify-center py-6 text-center p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Nenhuma transação encontrada</p>
        <p className="text-xs text-gray-500">Não há transações para o período selecionado.</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-1">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="overflow-hidden">
          <TransactionItem
            transaction={transaction}
            onEdit={() => onTransactionEdit(transaction)}
            onDelete={() => onTransactionDelete(transaction.id)}
          />
        </Card>
      ))}
    </div>
  );
};

export default TransactionListContent;
