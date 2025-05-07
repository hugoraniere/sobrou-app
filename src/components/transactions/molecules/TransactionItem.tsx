
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
      "group flex justify-between items-start p-4 border-b hover:bg-gray-50/80 transition-colors rounded-lg relative",
      className
    )}>
      {/* Barra vertical colorida */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      
      <div className="flex flex-col flex-grow ml-3 mr-4">
        <h3 className="font-medium text-gray-900 truncate max-w-[220px] sm:max-w-[300px] mb-2">
          {transaction.description}
        </h3>
        
        <CategoryChip categoryId={transaction.category} />
      </div>
      
      <div className="flex items-center">
        <div className="flex flex-col items-end">
          <TransactionAmount 
            amount={transaction.amount} 
            type={transaction.type as 'income' | 'expense'} 
            className="mb-1"
          />
          <TransactionDate 
            date={transaction.date} 
            format="dd/MM/yyyy"
          />
        </div>
        
        <ActionsMenu
          onEdit={onEdit}
          onDelete={onDelete}
          className="ml-4"
        />
      </div>
    </div>
  );
};

export default TransactionItem;
