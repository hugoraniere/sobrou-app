
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExtractedTransactionsTable } from '@/components/transactions/ExtractedTransactionsTable';
import { ExtractedTransaction } from '@/services/bankStatementService';

interface ConfirmTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: ExtractedTransaction[];
  onToggleSelection: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
  onImport: () => void;
  isProcessing: boolean;
}

export const ConfirmTransactionsDialog: React.FC<ConfirmTransactionsDialogProps> = ({
  open,
  onOpenChange,
  transactions,
  onToggleSelection,
  onSelectAll,
  onImport,
  isProcessing,
}) => {
  const { t } = useTranslation();

  const hasSelectedTransactions = transactions.some(tx => tx.selected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t('transactions.reviewExtractedTransactions', 'Revisar Transações Extraídas')}
          </DialogTitle>
          <DialogDescription>
            {t('transactions.selectTransactionsToImport', 'Selecione as transações que deseja importar')}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="flex justify-end mb-2 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSelectAll(true)}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              {t('common.selectAll', 'Selecionar Todos')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSelectAll(false)}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {t('common.deselectAll', 'Desselecionar Todos')}
            </Button>
          </div>
          
          <ExtractedTransactionsTable
            transactions={transactions}
            onToggleSelection={onToggleSelection}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button 
            onClick={onImport} 
            disabled={isProcessing || !hasSelectedTransactions}
          >
            {isProcessing ? 
              t('common.processing', 'Processando...') : 
              t('transactions.importSelectedTransactions', 'Importar Selecionados')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
