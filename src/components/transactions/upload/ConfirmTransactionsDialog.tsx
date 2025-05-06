
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExtractedTransactionsTable } from '@/components/transactions/ExtractedTransactionsTable';
import { ExtractedTransaction } from '@/services/bankStatementService';
import { Badge } from '@/components/ui/badge';
import { transactionCategories } from '@/data/categories';

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
  
  // Verificar se há categorias inválidas nas transações selecionadas
  const hasInvalidCategories = transactions
    .filter(tx => tx.selected)
    .some(tx => !tx.category || !transactionCategories.some(cat => cat.id === tx.category));

  // Handler para atualizar a categoria de uma transação
  const handleUpdateCategory = (index: number, newCategory: string) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      category: newCategory
    };
    // Como não podemos mutar diretamente transactions, vamos notificar o componente pai
    // Isso seria implementado no BankStatementUpload.tsx
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t('transactions.reviewExtractedTransactions', 'Revisar Transações Extraídas')}
          </DialogTitle>
          <DialogDescription>
            {t('transactions.selectTransactionsToImport', 'Selecione as transações que deseja importar')}
            {hasInvalidCategories && (
              <div className="flex items-center gap-2 mt-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Existem categorias que precisam ser revisadas (destacadas em vermelho)</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 max-h-[70vh] flex flex-col">
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
            onUpdateCategory={handleUpdateCategory}
          />
        </div>

        <div className="flex justify-between items-center space-x-2 mt-4">
          <div className="text-sm text-gray-500">
            {hasInvalidCategories ? (
              <span className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                Categorias inválidas serão importadas sem categoria
              </span>
            ) : (
              <span>Todas as categorias estão válidas</span>
            )}
          </div>
          <div className="flex space-x-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
