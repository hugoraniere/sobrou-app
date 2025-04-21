
import React, { useState } from 'react';
import { Transaction, TransactionService } from '@/services/TransactionService';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import TransactionFormLayout from './ui/TransactionFormLayout';
import TransactionDetails from './ui/TransactionDetails';
import TransactionControls from './ui/TransactionControls';

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

  const handleSave = async () => {
    try {
      // Filter out is_recurring if it exists since the database doesn't support it
      const { is_recurring, ...updateData } = editedTransaction as any;
      
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
    <TransactionFormLayout
      title={t('transactions.editTitle', 'Editar Transação')}
      description={t('transactions.editDescription', 'Modifique os detalhes da transação abaixo')}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={className}
      footer={
        <TransactionControls 
          onClose={() => setIsOpen(false)} 
          onSave={handleSave}
        />
      }
    >
      <TransactionDetails
        transaction={editedTransaction}
        onInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
    </TransactionFormLayout>
  );
};

export default EditTransactionDialog;
