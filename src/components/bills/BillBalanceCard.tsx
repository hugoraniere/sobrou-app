
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BillBalanceCardProps {
  originalAmount: number;
  currentBalance: number;
  transactionsTotal: number;
  hasTransactions: boolean;
}

export const BillBalanceCard: React.FC<BillBalanceCardProps> = ({
  originalAmount,
  currentBalance,
  transactionsTotal,
  hasTransactions,
}) => {
  const isFullyPaid = currentBalance <= 0;
  const hasPartialPayment = hasTransactions && currentBalance > 0 && currentBalance < originalAmount;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Valor Original */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Valor Original</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(originalAmount)}
            </div>
          </div>

          {/* Transações */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              {transactionsTotal < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : transactionsTotal > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">Transações</span>
            </div>
            <div className={`text-lg font-bold ${
              transactionsTotal < 0 ? 'text-red-600' : 
              transactionsTotal > 0 ? 'text-green-600' : 'text-gray-500'
            }`}>
              {transactionsTotal !== 0 && (transactionsTotal > 0 ? '+' : '')}
              {hasTransactions ? formatCurrency(Math.abs(transactionsTotal)) : formatCurrency(0)}
            </div>
          </div>

          {/* Saldo Atual */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Saldo Atual</span>
            </div>
            <div className={`text-lg font-bold ${
              isFullyPaid ? 'text-green-600' : 'text-gray-900'
            }`}>
              {formatCurrency(Math.max(0, currentBalance))}
            </div>
            
            {/* Status Badges */}
            <div className="mt-2 flex justify-center">
              {isFullyPaid ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Quitada
                </Badge>
              ) : hasPartialPayment ? (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  Pagamento Parcial
                </Badge>
              ) : hasTransactions ? (
                <Badge variant="outline" className="border-blue-500 text-blue-700">
                  Com Movimentação
                </Badge>
              ) : (
                <Badge variant="outline">
                  Sem Movimentação
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
