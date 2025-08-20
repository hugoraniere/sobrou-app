
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Edit, Trash2, MoreVertical, ArrowUp, ArrowDown, Repeat } from 'lucide-react';
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

interface TransactionCardMobileProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;
  showCardPadding?: boolean;
}

const TransactionCardMobile: React.FC<TransactionCardMobileProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
  showCardPadding = false
}) => {
  const CategoryIcon = getCategoryIcon(transaction.category);
  const categoryColor = getCategoryColor(transaction.category);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Generate installment display text
  const getInstallmentDisplay = () => {
    if (transaction.installment_total && transaction.installment_index) {
      return `${transaction.installment_index}/${transaction.installment_total}`;
    }
    return null;
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
      className={cn(
        "flex flex-col bg-white w-full",
        showCardPadding ? "px-4" : "px-0"
      )}
      style={{ 
        paddingTop: '12px',
        paddingBottom: '12px',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderRadius: '8px'
      }}
    >
      {/* Primeira linha: Ícone + Título + Valor + Menu */}
      <div className={cn(
        "flex items-center justify-between w-full mb-2",
        showCardPadding ? "px-0" : "px-0"
      )}>
        {/* Lado esquerdo: Ícone + Título */}
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
          {/* Ícone circular com seta direcional */}
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
          )}>
            {transaction.type === 'income' ? (
              <ArrowUp className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-600" />
            )}
          </div>
          
          {/* Título truncado */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 
                  className="text-sm font-semibold text-gray-900 truncate"
                  style={{ 
                    maxWidth: showActions ? '120px' : '200px',
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
        </div>
        
        {/* Lado direito: Valor + Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* Segunda linha: Data + Chips */}
      <div className={cn(
        "flex items-center justify-between w-full",
        showCardPadding ? "px-0" : "px-0"
      )}>
        {/* Data */}
        <span className="text-xs text-gray-500">
          {formatDate(transaction.date)}
        </span>
        
        {/* Chips */}
        <div className="flex items-center gap-2">
          <CategoryChip />
          <TransactionStatusChip />
          
          {/* Recurring indicator */}
          {transaction.is_recurring && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100">
              <Repeat className="h-3 w-3 text-blue-600" />
              {getInstallmentDisplay() && (
                <span className="text-xs text-blue-600 font-medium">
                  {getInstallmentDisplay()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCardMobile;
