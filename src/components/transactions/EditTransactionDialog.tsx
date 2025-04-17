
import React, { useState } from 'react';
import { Transaction, TransactionService } from '@/services/TransactionService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface EditTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
  className?: string;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  transaction,
  onTransactionUpdated,
  className
}) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction>({...transaction});
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatação de valor em reais com vírgula apenas quando houver decimal
  const formatCurrency = (value: number) => {
    // Verifica se tem casas decimais
    const hasDecimals = value % 1 !== 0;
    
    if (hasDecimals) {
      // Formatação com vírgula e duas casas decimais
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // Formatação sem casas decimais
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const handleSave = async () => {
    try {
      // Filter out is_recurring if it exists since the database doesn't support it
      const { is_recurring, ...updateData } = editedTransaction;
      
      await TransactionService.updateTransaction(transaction.id, updateData);
      setIsOpen(false);
      onTransactionUpdated();
      toast.success(t('transactions.updateSuccess', 'Transação atualizada com sucesso'));
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error(t('transactions.updateError', 'Falha ao atualizar transação'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[500px]", className)}>
        <DialogHeader>
          <DialogTitle>{t('transactions.editTitle', 'Editar Transação')}</DialogTitle>
          <DialogDescription>
            {t('transactions.editDescription', 'Modifique os detalhes da transação abaixo')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              {t('transactions.date', 'Data')}
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={editedTransaction.date}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              {t('transactions.type', 'Tipo')}
            </Label>
            <Select 
              name="type" 
              value={editedTransaction.type}
              onValueChange={(value: 'income' | 'expense' | 'transfer') => handleSelectChange('type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('transactions.selectType', 'Selecione o tipo')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="income">{t('common.income', 'Receita')}</SelectItem>
                <SelectItem value="expense">{t('common.expense', 'Despesa')}</SelectItem>
                <SelectItem value="transfer">{t('transactions.transfer', 'Transferência')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              {t('transactions.category', 'Categoria')}
            </Label>
            <Select 
              name="category" 
              value={editedTransaction.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('transactions.selectCategory', 'Selecione a categoria')} />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                {transactionCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      {Icon && <Icon className="mr-2 inline h-4 w-4" />}
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t('transactions.description', 'Descrição')}
            </Label>
            <Input
              id="description"
              name="description"
              value={editedTransaction.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {t('transactions.amount', 'Valor')}
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={editedTransaction.amount}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button onClick={handleSave}>
            {t('transactions.save', 'Salvar alterações')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
