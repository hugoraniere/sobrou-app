
import React from 'react';
import { Transaction } from '@/services/transactions';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
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
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete
}) => {
  const { isMobile } = useResponsive();
  const Icon = getCategoryIcon(transaction.category);
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

  // Componente do chip de categoria
  const CategoryChip = () => (
    <div 
      className="flex justify-center items-center gap-1 px-1 py-0.5 rounded-[54px] text-white text-xs font-medium"
      style={{ 
        backgroundColor: categoryColor,
        boxShadow: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)'
      }}
    >
      <Icon className="h-3 w-3" />
      <span>{transaction.category}</span>
    </div>
  );

  // Componente do chip de status
  const StatusChip = () => (
    <div className="flex justify-center items-center px-1 py-0.5 rounded-[54px] bg-gray-100 text-gray-700 text-xs font-medium">
      Pago
    </div>
  );

  // Layout mobile
  if (isMobile) {
    return (
      <div 
        className="flex flex-col p-3 gap-2 rounded-lg bg-white w-full"
        style={{ maxWidth: '100%' }}
      >
        {/* Linha 1: Ícone + Título + Valor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Ícone circular */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            )}>
              <Icon className={cn(
                "h-5 w-5",
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              )} />
            </div>
            
            {/* Título truncado */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 
                    className="text-sm font-bold text-gray-900 truncate flex-1"
                    style={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={transaction.description}
                  >
                    {transaction.description}
                  </h4>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{transaction.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Valor */}
          <div className={cn(
            "text-right font-semibold text-sm flex-shrink-0",
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          )}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
        </div>

        {/* Linha 2: Data */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDate(transaction.date)}
          </span>
          
          {/* Menu de ações */}
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

        {/* Linha 3: Chips */}
        <div className="flex items-center gap-2">
          <CategoryChip />
          <StatusChip />
        </div>
      </div>
    );
  }

  // Layout desktop
  return (
    <div 
      className="flex w-full p-3 justify-between items-center rounded-lg bg-white"
      style={{ maxWidth: '1248px' }}
    >
      {/* Lado esquerdo: Ícone + Título/Data */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Ícone circular */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
        )}>
          <Icon className={cn(
            "h-5 w-5",
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          )} />
        </div>
        
        {/* Título e Data */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 
                  className="text-sm font-bold text-gray-900 truncate"
                  style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={transaction.description}
                >
                  {transaction.description}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <p>{transaction.description}</p>
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

        {/* Menu de ações */}
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
  );
};

export default TransactionCard;
