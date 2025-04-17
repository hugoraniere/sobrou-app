
import React, { useState } from 'react';
import { TransactionService } from '@/services/TransactionService';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import TransactionFormLayout from './ui/TransactionFormLayout';
import TransactionDetails from './ui/TransactionDetails';
import TransactionControls from './ui/TransactionControls';

interface AddTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTransactionAdded: () => void;
  className?: string;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  onTransactionAdded,
  className
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
          ? `Receita de ${formatCurrency(amountValue)} adicionada` 
          : `Despesa de ${formatCurrency(amountValue)} adicionada`
      );
      
      setIsOpen(false);
      onTransactionAdded();
      
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
    <TransactionFormLayout
      title={t('transactions.addNew', 'Adicionar Nova Transação')}
      description={t('transactions.description', 'Preencha os detalhes da transação abaixo')}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={className}
      footer={
        <TransactionControls 
          onClose={() => setIsOpen(false)} 
          onSave={handleSubmit}
          isSubmitting={isSubmitting}
        />
      }
    >
      <TransactionDetails
        transaction={newTransaction}
        onInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
    </TransactionFormLayout>
  );
};

export default AddTransactionDialog;
