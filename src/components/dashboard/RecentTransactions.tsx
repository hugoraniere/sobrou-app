
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const { t } = useTranslation();
  const recentTransactions = transactions.slice(0, 5); // Últimas 5 transações
  
  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          {t('dashboard.recentTransactions', 'Últimas Transações')}
        </CardTitle>
        <Link to="/transactions">
          <Button variant="link" size="sm" className="text-primary">
            {t('common.viewAll', 'Ver todas')}
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            {t('transactions.emptyState', 'Nenhuma transação encontrada')}
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              return (
                <div key={transaction.id} className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
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
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
