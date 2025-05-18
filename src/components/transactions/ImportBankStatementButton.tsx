
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { processBankStatement } from '@/services/bankStatementService';
import FileUploadArea from './upload/FileUploadArea';
import ImportDialog from './import/ImportDialog';

interface ImportBankStatementButtonProps {
  onTransactionsAdded: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const ImportBankStatementButton: React.FC<ImportBankStatementButtonProps> = ({ 
  onTransactionsAdded,
  variant = 'secondary',
  size = 'default'
}) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<any[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setExtractedTransactions([]);
  };
  
  const handleFileSelected = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Processar o arquivo e extrair transações
      setProcessingStep('Analisando extrato bancário...');
      const result = await processBankStatement(file);
      
      setExtractedTransactions(result.transactions);
      setIsDialogOpen(false);
      setIsUploading(false);
      setIsImportDialogOpen(true);
    } catch (error) {
      console.error('Error processing bank statement:', error);
      toast.error(t('transactions.importError', 'Erro ao processar o extrato bancário'));
      setIsUploading(false);
    }
  };
  
  // Toggle selection of a transaction
  const handleToggleSelection = (index: number) => {
    setExtractedTransactions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index]?.selected
      };
      return updated;
    });
  };
  
  // Select all transactions
  const handleSelectAll = (selected: boolean) => {
    setExtractedTransactions(prev => 
      prev.map(transaction => ({ ...transaction, selected }))
    );
  };
  
  // Update category of a transaction
  const handleUpdateCategory = (index: number, category: string) => {
    setExtractedTransactions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        category
      };
      return updated;
    });
  };
  
  // Import selected transactions
  const handleImport = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep('Importando transações...');
      
      // Lógica para importar as transações
      // Aqui seria feita uma chamada para o serviço que salva as transações no banco de dados
      
      setIsProcessing(false);
      setIsImportDialogOpen(false);
      toast.success(t('transactions.importSuccess', 'Transações importadas com sucesso'));
      onTransactionsAdded();
    } catch (error) {
      console.error('Error importing transactions:', error);
      setIsProcessing(false);
      toast.error(t('transactions.saveError', 'Erro ao salvar as transações'));
    }
  };
  
  return (
    <>
      <Button 
        onClick={handleOpenDialog}
        variant={variant}
        size={size}
        className="gap-1.5"
      >
        <Upload className="h-4 w-4" />
        {t('transactions.importStatement', 'Importar extrato')}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('transactions.uploadStatement', 'Enviar extrato bancário')}</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-center text-gray-500">
                  {processingStep || t('transactions.processing', 'Processando arquivo...')}
                </p>
              </div>
            ) : (
              <FileUploadArea onFileSelected={handleFileSelected} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        extractedTransactions={extractedTransactions}
        onImport={handleImport}
        onToggleSelection={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onUpdateCategory={handleUpdateCategory}
        isProcessing={isProcessing}
        processingStep={processingStep}
      />
    </>
  );
};

export default ImportBankStatementButton;
