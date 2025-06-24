
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Card } from '@/components/ui/card';
import TransactionItem from './TransactionItem';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

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
  const { isMobile } = useResponsive();

  if (isEmpty) {
    return (
      <Card className="flex flex-col items-center justify-center py-6 text-center p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Nenhuma transação encontrada</p>
        <p className="text-xs text-gray-500">Não há transações para o período selecionado.</p>
      </Card>
    );
  }
  
  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-0" : "max-w-[1248px] mx-auto"
    )}>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={cn(isMobile ? "px-4" : "px-0")}>
              <TransactionItem
                transaction={transaction}
                onEdit={() => onTransactionEdit(transaction)}
                onDelete={() => onTransactionDelete(transaction.id)}
                showCardPadding={showCardPadding}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransactionListContent;
