
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TransactionCategoryCell from '../cells/TransactionCategoryCell';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResponsive } from '@/hooks/useResponsive';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete
}) => {
  const { isMobile } = useResponsive();

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className={cn(
      "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
      isMobile ? "border-b border-gray-100 last:border-b-0" : ""
    )}>
      <div className="flex items-center justify-between">
        {/* Left side: Main info */}
        <div className="flex-1 min-w-0">
          {/* First row: Description and amount */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-3">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </h4>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-500">
                  {formatDate(transaction.date)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className={cn(
                  "text-xs font-medium",
                  transaction.type === 'income' ? 'text-green-600' : 'text-blue-600'
                )}>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={cn(
                "text-right",
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              )}>
                <div className="font-semibold text-sm">
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Second row: Category */}
          <div className="flex items-center">
            <TransactionCategoryCell category={transaction.category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
