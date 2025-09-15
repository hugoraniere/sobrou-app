
import React, { useState } from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import type { TransactionRowProps } from '@/types/component-types';
import TransactionTypeCell from './cells/TransactionTypeCell';
import TransactionCategoryCell from './cells/TransactionCategoryCell';
import TransactionAmountCell from './cells/TransactionAmountCell';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import ActionsCell from './cells/ActionsCell';
import { useTransactionRow } from '@/hooks/useTransactionRow';
import { toast } from 'sonner';
import { Transaction, TransactionService } from '@/services/transactions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TransactionDatePicker from '../prompt/TransactionDatePicker';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionCategories } from '@/data/categories';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate,
  onTransactionUpdated,
  className
}) => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    handleToggleRecurring
  } = useTransactionRow(transaction, onToggleRecurring, onTransactionUpdated);

  // Estados para edição inline
  const [isEditing, setIsEditing] = useState<{
    date: boolean;
    type: boolean;
    category: boolean;
    description: boolean;
    amount: boolean;
  }>({
    date: false,
    type: false,
    category: false,
    description: false,
    amount: false
  });
  
  const [editValues, setEditValues] = useState({
    date: new Date(transaction.date),
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount
  });

  // Funções para manipular a edição inline
  const startEditing = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const cancelEditing = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    // Restaurar valor original
    setEditValues(prev => ({ 
      ...prev, 
      [field]: field === 'date' 
        ? new Date(transaction.date) 
        : transaction[field]
    }));
  };

  const handleValueChange = (field: keyof typeof editValues, value: any) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    
    // Auto-salvar para campos de seleção (data, tipo, categoria)
    if (field === 'date' || field === 'type' || field === 'category') {
      saveChange(field, value);
    }
  };

  const saveChange = async (field: keyof typeof isEditing, value?: any) => {
    try {
      const updatedValue = value !== undefined ? value : 
        field === 'date' 
          ? format(editValues.date, 'yyyy-MM-dd')
          : editValues[field];
          
      await TransactionService.updateTransaction(transaction.id, {
        [field]: updatedValue
      });
      
      setIsEditing(prev => ({ ...prev, [field]: false }));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} atualizado com sucesso`);
      onTransactionUpdated();
    } catch (error) {
      console.error(`Erro ao atualizar ${field}:`, error);
      toast.error(`Erro ao atualizar ${field}`);
      cancelEditing(field);
    }
  };

  // Renderização de células editáveis
  const renderDateCell = () => {
    if (isEditing.date) {
      return (
        <TableCell className="min-w-[100px] whitespace-nowrap">
          <Popover open={true} onOpenChange={(open) => !open && cancelEditing('date')}>
            <PopoverTrigger asChild>
              <div className="h-9 w-full cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200 flex items-center">
                {formatDate(transaction.date)}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <TransactionDatePicker
                date={editValues.date}
                onDateChange={(date) => {
                  if (date) {
                    handleValueChange('date', date);
                  }
                }}
                className="h-9 w-full hidden"
              />
            </PopoverContent>
          </Popover>
        </TableCell>
      );
    }
    return (
      <TableCell 
        className="min-w-[100px] whitespace-nowrap cursor-pointer hover:bg-gray-50"
        onClick={() => startEditing('date')}
      >
        {formatDate(transaction.date)}
      </TableCell>
    );
  };

  const renderTypeCell = () => {
    if (isEditing.type) {
      return (
        <TableCell className="min-w-[100px]">
          <Popover open={true} onOpenChange={(open) => !open && cancelEditing('type')}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200">
                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="py-1">
                <div 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleValueChange('type', 'income')}
                >
                  Receita
                </div>
                <div 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleValueChange('type', 'expense')}
                >
                  Despesa
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      );
    }
    return (
      <TableCell 
        className="min-w-[100px] whitespace-nowrap cursor-pointer hover:bg-gray-50"
        onClick={() => startEditing('type')}
      >
        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
      </TableCell>
    );
  };

  const renderCategoryCell = () => {
    if (isEditing.category) {
      return (
        <TableCell className="min-w-[140px]">
          <Popover open={true} onOpenChange={(open) => !open && cancelEditing('category')}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200">
                <TransactionCategoryCell category={transaction.category} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto">
                {transactionCategories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                    onClick={() => handleValueChange('category', category.id)}
                  >
                    <span className="flex h-5 w-5 items-center justify-center">
                      {category.icon && <category.icon className="h-4 w-4" />}
                    </span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      );
    }
    return (
      <TableCell 
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => startEditing('category')}
      >
        <TransactionCategoryCell category={transaction.category} />
      </TableCell>
    );
  };

  const renderDescriptionCell = () => {
    if (isEditing.description) {
      return (
        <TableCell className="max-w-[200px]">
          <div className="flex items-center gap-1">
            <Input
              value={editValues.description}
              onChange={(e) => handleValueChange('description', e.target.value)}
              className="h-9"
              autoFocus
            />
            <div className="flex">
              <Button 
                size="icon" 
                className="h-9 w-9" 
                variant="ghost"
                onClick={() => cancelEditing('description')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-9 w-9" 
                onClick={() => saveChange('description')}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TableCell>
      );
    }
    return (
      <TableCell 
        className="max-w-[200px] cursor-pointer hover:bg-gray-50"
        onClick={() => startEditing('description')}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate">
                {transaction.description}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{transaction.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    );
  };

  const renderAmountCell = () => {
    if (isEditing.amount) {
      return (
        <TableCell className="text-left whitespace-nowrap w-[160px]">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              step="0.01"
              value={editValues.amount}
              onChange={(e) => handleValueChange('amount', parseFloat(e.target.value))}
              className="h-9"
              autoFocus
            />
            <div className="flex">
              <Button 
                size="icon" 
                className="h-9 w-9" 
                variant="ghost"
                onClick={() => cancelEditing('amount')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-9 w-9" 
                onClick={() => saveChange('amount')}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TableCell>
      );
    }
    return (
      <TableCell 
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => startEditing('amount')}
      >
        <div className={cn(
          "text-left font-medium whitespace-nowrap",
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        )}>
          {transaction.type === 'income' ? '+' : '-'}
          {transaction.amount.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </div>
      </TableCell>
    );
  };

  return (
    <>
      <TableRow className={cn("hover:bg-gray-50 relative", className)}>
        {renderDateCell()}
        {renderTypeCell()}
        {renderCategoryCell()}
        {renderDescriptionCell()}
        {renderAmountCell()}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <ActionsCell
            isRecurring={transaction.is_recurring || false}
            onToggleRecurring={handleToggleRecurring}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      <EditTransactionDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        transaction={transaction}
        onTransactionUpdated={onTransactionUpdated}
      />

      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        transactionId={transaction.id}
        onTransactionUpdated={onTransactionUpdated}
      />
    </>
  );
};

export default TransactionRow;
