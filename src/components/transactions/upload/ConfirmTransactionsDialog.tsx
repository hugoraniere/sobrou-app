
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExtractedTransactionsTable } from '@/components/transactions/ExtractedTransactionsTable';
import { ExtractedTransaction } from '@/services/bankStatementService';
import { Badge } from '@/components/ui/badge';
import { transactionCategories } from '@/data/categories';
import { Progress } from '@/components/ui/progress';

interface ConfirmTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: ExtractedTransaction[];
  onToggleSelection: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
  onImport: () => void;
  isProcessing: boolean;
  onUpdateCategory?: (index: number, newCategory: string) => void;
  processingStep?: string;
}

export const ConfirmTransactionsDialog: React.FC<ConfirmTransactionsDialogProps> = ({
  open,
  onOpenChange,
  transactions,
  onToggleSelection,
  onSelectAll,
  onImport,
  isProcessing,
  onUpdateCategory,
  processingStep,
}) => {
  const { t } = useTranslation();

  const hasSelectedTransactions = transactions.some(tx => tx.selected);
  
  // Verificar se há categorias inválidas nas transações selecionadas
  const hasInvalidCategories = transactions
    .filter(tx => tx.selected)
    .some(tx => !tx.category || !transactionCategories.some(cat => cat.id === tx.category));
    
  // Contar categorias inválidas
  const invalidCategoriesCount = transactions
    .filter(tx => tx.selected)
    .filter(tx => !tx.category || !transactionCategories.some(cat => cat.id === tx.category))
    .length;

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
                <span>{invalidCategoriesCount} {invalidCategoriesCount === 1 ? 'categoria precisa' : 'categorias precisam'} de revisão</span>
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
          
          <div className="max-h-[50vh] overflow-auto">
            <ExtractedTransactionsTable
              transactions={transactions}
              onToggleSelection={onToggleSelection}
              onUpdateCategory={onUpdateCategory}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-4">
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{processingStep || 'Processando...'}</span>
                <span>Aguarde, não feche esta janela</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {hasInvalidCategories ? (
                <span className="flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {invalidCategoriesCount} {invalidCategoriesCount === 1 ? 'categoria será importada' : 'categorias serão importadas'} sem categorização correta
                </span>
              ) : (
                <span>Todas as categorias estão válidas</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
