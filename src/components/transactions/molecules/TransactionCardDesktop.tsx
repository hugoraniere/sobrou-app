
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Edit, Trash2, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColor } from '@/constants/categoryColors';
import { formatCurrency, capitalizeFirstLetter } from './TransactionCardFormatters';
import TransactionStatusChip from './TransactionStatusChip';

interface TransactionCardDesktopProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;
}

const TransactionCardDesktop: React.FC<TransactionCardDesktopProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const CategoryIcon = getCategoryIcon(transaction.category);
  const categoryColor = getCategoryColor(transaction.category);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const CategoryChip = () => (
    <div 
      className="flex justify-center items-center gap-1 px-2 py-1 rounded-[54px] text-white text-xs"
      style={{ backgroundColor: categoryColor }}
    >
      <CategoryIcon className="h-3 w-3" />
      <span>{transaction.category}</span>
    </div>
  );

  return (
    <div 
      className="flex w-full p-3 justify-between items-center rounded-lg bg-white"
      style={{ maxWidth: '1248px' }}
    >
      {/* Lado esquerdo: Ícone + Título/Data */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Ícone circular com seta direcional */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
        )}>
          {transaction.type === 'income' ? (
            <ArrowUp className="h-6 w-6 text-green-600" />
          ) : (
            <ArrowDown className="h-6 w-6 text-red-600" />
          )}
        </div>
        
        {/* Título e Data */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 
                  className="text-sm font-semibold text-gray-900 truncate"
                  style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={transaction.description}
                >
                  {capitalizeFirstLetter(transaction.description)}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <p>{capitalizeFirstLetter(transaction.description)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-gray-500 mt-1">
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      {/* Centro: Chips */}
      <div className="flex items-center gap-2 mx-4">
        <CategoryChip />
        <TransactionStatusChip />
      </div>

      {/* Lado direito: Valor + Menu */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Valor */}
        <div className={cn(
          "text-right font-semibold text-sm",
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        )}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>

        {/* Menu de ações */}
        {showActions && (
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
        )}
      </div>
    </div>
  );
};

export default TransactionCardDesktop;
