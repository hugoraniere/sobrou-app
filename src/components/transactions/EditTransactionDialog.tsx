import React, { useState } from 'react';
import { Transaction, TransactionService } from '@/services/transactions';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
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

  const handleSelectChange = (name: string, value: string | boolean) => {
    setEditedTransaction(prev => ({
      ...prev,
      [name]: name === 'installment_total' 
        ? (value ? parseInt(value as string) : undefined)
        : value,
      ...(name === 'is_recurring' && value === false 
        ? { 
            recurrence_frequency: undefined, 
            next_due_date: undefined,
            recurrence_end_date: undefined,
            installment_total: undefined,
            installment_index: undefined
          }
        : {}),
      ...(name === 'is_recurring' && value === true
        ? { recurrence_frequency: prev.recurrence_frequency || 'monthly' }
        : {})
    }));
  };

  const handleSave = async () => {
    try {
      await TransactionService.updateTransaction(transaction.id, editedTransaction);
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
