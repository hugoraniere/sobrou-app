
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {t('transactions.add', 'Nova Transação')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {t('transactions.addDescription', 'Adicione uma nova transação rapidamente')}
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
