
import React from 'react';
import { Transaction } from '@/services/transactions';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(0, 8); // Mostra até 8 transações
  
  return (
    <div className="space-y-3">
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma transação encontrada
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.category);
            
            return (
              <div key={transaction.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    <Badge variant="outline" className="text-xs bg-gray-50 px-1 py-0">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    "text-sm font-semibold",
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
