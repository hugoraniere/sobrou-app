
import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/currencyUtils';

interface TransactionAmountProps {
  amount: number;
  type: 'income' | 'expense';
  className?: string;
  showSign?: boolean;
}

const TransactionAmount: React.FC<TransactionAmountProps> = ({ 
  amount, 
  type,
  className,
  showSign = true
}) => {
  return (
    <div className={cn(
      "text-right font-medium",
      type === 'income' ? 'text-green-600' : 'text-red-600',
      className
    )}>
      {showSign && (type === 'income' ? '+' : '-')} {formatCurrency(amount)}
    </div>
  );
};

export default TransactionAmount;
