
import React from 'react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/services/transactions';
import CategoryChip from '../atoms/CategoryChip';
import TransactionAmount from '../atoms/TransactionAmount';
import TransactionDate from '../atoms/TransactionDate';
import ActionsMenu from './ActionsMenu';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onEdit,
  onDelete,
  className 
}) => {
  return (
    <div className={cn(
      "flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors",
      className
    )}>
      <div className="flex flex-col flex-grow mr-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-gray-900 truncate max-w-[220px] sm:max-w-[300px]">
            {transaction.description}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <CategoryChip categoryId={transaction.category} />
          <TransactionDate date={transaction.date} />
        </div>
      </div>
      
      <div className="flex items-center">
        <TransactionAmount 
          amount={transaction.amount} 
          type={transaction.type as 'income' | 'expense'} 
          className="mr-4"
        />
        
        <ActionsMenu
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default TransactionItem;
