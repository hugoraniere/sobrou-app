
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
import { useResponsive } from '@/hooks/useResponsive';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;
  showCardPadding?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
  showCardPadding = false
}) => {
  const { isMobile } = useResponsive();
  const CategoryIcon = getCategoryIcon(transaction.category);
  const categoryColor = getCategoryColor(transaction.category);

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Componente do chip de categoria
  const CategoryChip = () => (
    <div 
      className="flex justify-center items-center gap-1 px-2 py-1 rounded-[54px] text-white text-xs"
      style={{ backgroundColor: categoryColor }}
    >
      <CategoryIcon className="h-3 w-3" />
      <span>{transaction.category}</span>
    </div>
  );

  // Componente do chip de status
  const StatusChip = () => (
    <div className="flex justify-center items-center px-2 py-1 rounded-[54px] bg-gray-100 text-gray-700 text-xs">
      Pago
    </div>
  );

  // Layout mobile
  if (isMobile) {
    return (
      <div 
        className={cn(
          "flex flex-col bg-white w-full max-w-[328px] mx-auto",
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
        {/* Primeira linha: Ícone + Título + Valor + Menu (se showActions for true) */}
        <div className={cn(
          "flex items-center justify-between w-full mb-2",
          showCardPadding ? "px-0" : "px-4"
        )}>
          {/* Lado esquerdo: Ícone + Título */}
          <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
            {/* Ícone circular com seta direcional - 24px no mobile */}
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
            
            {/* Título truncado - mais agressivo */}
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
          
          {/* Lado direito: Valor + Menu (se showActions for true) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Valor */}
            <div className={cn(
              "text-right font-semibold text-sm",
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            )}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>

            {/* Menu de ações - só mostra se showActions for true */}
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
          showCardPadding ? "px-0" : "px-4"
        )}>
          {/* Data */}
          <span className="text-xs text-gray-500">
            {formatDate(transaction.date)}
          </span>
          
          {/* Chips */}
          <div className="flex items-center gap-2">
            <CategoryChip />
            <StatusChip />
          </div>
        </div>
      </div>
    );
  }

  // Layout desktop - mantido exatamente igual
  return (
    <div 
      className="flex w-full p-3 justify-between items-center rounded-lg bg-white"
      style={{ maxWidth: '1248px' }}
    >
      {/* Lado esquerdo: Ícone + Título/Data */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Ícone circular com seta direcional - 40px no desktop */}
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
        <StatusChip />
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

        {/* Menu de ações - só mostra se showActions for true */}
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

export default TransactionCard;
