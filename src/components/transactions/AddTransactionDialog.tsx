
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TransactionForm from './components/TransactionForm';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ 
  open, 
  onOpenChange,
  onTransactionAdded 
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('transactions.add', 'Adicionar Transação')}</DialogTitle>
          <DialogDescription>
            {t('transactions.addDescription', 'Preencha os detalhes da nova transação')}
          </DialogDescription>
        </DialogHeader>
        
        <TransactionForm onSuccess={() => {
          onOpenChange(false);
          if (onTransactionAdded) {
            onTransactionAdded();
          }
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
