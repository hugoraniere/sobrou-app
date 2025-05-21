
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
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const Icon = getCategoryIcon(transaction.category);
        return (
          <div key={transaction.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            )}>
              <Icon className={cn(
                "h-5 w-5",
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{transaction.description}</p>
              <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
            </div>
            
            <div className="text-right">
              <p className={cn(
                "text-sm font-semibold",
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              )}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <Badge variant="outline" className="text-xs bg-gray-50">
                {transaction.category}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactions;
