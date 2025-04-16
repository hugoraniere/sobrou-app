
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
  const today = new Date().toISOString().split('T')[0];
  const { t } = useTranslation();
  
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    category: 'other',
    type: 'expense',
    date: today
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const amountValue = parseFloat(newTransaction.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Por favor, insira um valor válido");
      return;
    }

    setIsSubmitting(true);

    try {
      await TransactionService.addTransaction({
        amount: amountValue,
        description: newTransaction.description,
        category: newTransaction.category,
        type: newTransaction.type as 'expense' | 'income',
        date: newTransaction.date
      });

      toast.success(
        newTransaction.type === 'income' 
          ? `Receita de R$${amountValue.toFixed(2)} adicionada` 
          : `Despesa de R$${amountValue.toFixed(2)} adicionada`
      );
      
      setIsOpen(false);
      onTransactionAdded();
      
      // Reset form
      setNewTransaction({
        amount: '',
        description: '',
        category: 'other',
        type: 'expense',
        date: today
      });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error("Falha ao adicionar transação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transactions.addNew', 'Adicionar Nova Transação')}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da transação abaixo
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
              onValueChange={(value) => handleSelectChange('type', value)}
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : t('transactions.addNew', 'Adicionar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
