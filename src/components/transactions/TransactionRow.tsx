
import React, { useState } from 'react';
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
  };

  const saveChange = async (field: keyof typeof isEditing) => {
    try {
      const updatedValue = field === 'date' 
        ? editValues.date.toISOString().split('T')[0]
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
          <div className="flex flex-col gap-2">
            <TransactionDatePicker
              date={editValues.date}
              onDateChange={(date) => handleValueChange('date', date || new Date())}
              className="h-9 w-full"
            />
            <div className="flex justify-end gap-1">
              <Button 
                size="icon" 
                className="h-6 w-6" 
                variant="ghost"
                onClick={() => cancelEditing('date')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => saveChange('date')}
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
          <div className="flex flex-col gap-2">
            <Select 
              value={editValues.type} 
              onValueChange={(value) => handleValueChange('type', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-1">
              <Button 
                size="icon" 
                className="h-6 w-6" 
                variant="ghost"
                onClick={() => cancelEditing('type')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => saveChange('type')}
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
          <div className="flex flex-col gap-2">
            <Select 
              value={editValues.category} 
              onValueChange={(value) => handleValueChange('category', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {transactionCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <category.icon className="h-4 w-4" />}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-1">
              <Button 
                size="icon" 
                className="h-6 w-6" 
                variant="ghost"
                onClick={() => cancelEditing('category')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => saveChange('category')}
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
          <div className="flex flex-col gap-2">
            <Input
              value={editValues.description}
              onChange={(e) => handleValueChange('description', e.target.value)}
              className="h-9"
            />
            <div className="flex justify-end gap-1">
              <Button 
                size="icon" 
                className="h-6 w-6" 
                variant="ghost"
                onClick={() => cancelEditing('description')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-6 w-6" 
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
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              value={editValues.amount}
              onChange={(e) => handleValueChange('amount', parseFloat(e.target.value))}
              className="h-9"
            />
            <div className="flex justify-end gap-1">
              <Button 
                size="icon" 
                className="h-6 w-6" 
                variant="ghost"
                onClick={() => cancelEditing('amount')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-6 w-6" 
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
          {`R$${transaction.amount.toLocaleString('pt-BR', { 
            minimumFractionDigits: transaction.amount % 1 !== 0 ? 2 : 0,
            maximumFractionDigits: 2
          })}`}
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
