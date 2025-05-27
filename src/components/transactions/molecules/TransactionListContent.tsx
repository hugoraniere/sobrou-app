
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Card } from '@/components/ui/card';
import TransactionItem from './TransactionItem';

interface TransactionListContentProps {
  transactions: Transaction[];
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (id: string) => void;
  isEmpty?: boolean;
  showCardPadding?: boolean;
}

const TransactionListContent: React.FC<TransactionListContentProps> = ({
  transactions,
  onTransactionEdit,
  onTransactionDelete,
  isEmpty = false,
  showCardPadding = false
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
    <div className="w-full" style={{ maxWidth: '1248px', margin: '0 auto' }}>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <TransactionItem
              transaction={transaction}
              onEdit={() => onTransactionEdit(transaction)}
              onDelete={() => onTransactionDelete(transaction.id)}
              showCardPadding={showCardPadding}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransactionListContent;
