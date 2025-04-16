
import React, { useState } from 'react';
import { TransactionService } from '@/services/TransactionService';
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

interface AddTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTransactionAdded: () => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  onTransactionAdded
}) => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  
  const [newTransaction, setNewTransaction] = useState({
    date: today,
    type: 'expense' as 'expense' | 'income' | 'transfer',
    category: 'groceries',
    description: '',
    amount: 0,
    is_recurring: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await TransactionService.addTransaction(newTransaction);
      setIsOpen(false);
      onTransactionAdded();
      setNewTransaction({
        date: today,
        type: 'expense' as 'expense' | 'income' | 'transfer',
        category: 'groceries',
        description: '',
        amount: 0,
        is_recurring: false
      });
      toast.success(t('transactions.addSuccess', 'Transação adicionada com sucesso'));
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error(t('transactions.addError', 'Falha ao adicionar transação'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transactions.addTitle', 'Inserir sua transação')}</DialogTitle>
          <DialogDescription>
            {t('transactions.addDescription', 'Informe os detalhes da nova transação abaixo')}
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
              value={newTransaction.date}
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
              value={newTransaction.type}
              onValueChange={(value: 'income' | 'expense' | 'transfer') => handleSelectChange('type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('transactions.selectType', 'Selecione o tipo')} />
              </SelectTrigger>
              <SelectContent>
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
              value={newTransaction.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('transactions.selectCategory', 'Selecione a categoria')} />
              </SelectTrigger>
              <SelectContent>
                {transactionCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon && React.createElement(category.icon, { className: "h-4 w-4 mr-2 inline" })}
                    {category.name}
                  </SelectItem>
                ))}
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
              value={newTransaction.description}
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
              value={newTransaction.amount}
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
            {t('transactions.save', 'Salvar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
