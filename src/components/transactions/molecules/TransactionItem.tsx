
import React from 'react';
import { Transaction } from '@/services/transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import CategoryChip from '../ui/CategoryChip';
import { transactionCategories } from '@/data/categories';
import { MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currencyUtils';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  // Format date from ISO string (YYYY-MM-DD) to DD/MM/YYYY
  const formattedDate = (() => {
    try {
      const date = typeof transaction.date === 'string' 
        ? new Date(transaction.date)
        : transaction.date;
      
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Data inválida';
    }
  })();

  // Find category details
  const category = transactionCategories.find(c => c.id === transaction.category) || {
    id: 'other',
    name: 'Outros',
    color: 'gray'
  };
  
  const IconComponent = getCategoryIcon(category.id);
  
  return (
    <div className={cn(
      "flex justify-between items-center px-3 py-1.5 hover:bg-gray-50 border-t first:border-t-0 transition-colors",
      transaction.type === 'income' ? "border-l-4 border-l-green-500" : "border-l-4 border-l-gray-200"
    )}>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex h-6 w-6 rounded-full bg-gray-100 items-center justify-center text-gray-500">
          <IconComponent className="h-3 w-3" />
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-900 line-clamp-1">{transaction.description}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <span className="text-gray-300 text-xs">•</span>
            <CategoryChip category={transaction.category} className="px-1 py-0.5 text-xs" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <span className={cn(
          "font-medium text-xs",
          transaction.type === 'income' ? 'text-green-600' : 'text-gray-700'
        )}>
          {transaction.type === 'income' ? '+ ' : ''}
          {formatCurrency(transaction.amount)}
        </span>
        
        {(onEdit || onDelete) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end" side="left">
              <div className="flex flex-col gap-1 text-xs">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(transaction)}
                    className="justify-start h-6"
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(transaction.id)}
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-6"
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
