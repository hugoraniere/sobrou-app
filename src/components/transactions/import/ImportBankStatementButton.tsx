
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { bankStatementService, ExtractedTransaction } from '@/services/bankStatementService';
import { FileExtractor } from './FileExtractor';
import ImportDialog from './ImportDialog';
import { usePdfExtractor } from '@/hooks/usePdfExtractor';
import { FileProcessor } from './FileProcessor';

interface ImportBankStatementButtonProps {
  onTransactionsAdded: () => void;
}

const ImportBankStatementButton: React.FC<ImportBankStatementButtonProps> = ({ 
  onTransactionsAdded 
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("Nenhum arquivo selecionado");
      return;
    }

    console.log("Arquivo selecionado:", file.name, "tipo:", file.type, "tamanho:", file.size);
    
    // Verificar tamanho do arquivo
    if (FileProcessor.isFileTooLarge(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    setIsUploading(true);
    setProcessingStep('Iniciando processamento');
    setProcessingProgress(5);
    
    // Mostrar toast de processamento
    const processingToast = toast.loading("Processando extrato bancário. Isso pode demorar alguns segundos...", {
      duration: 60000, // Manter por 60 segundos ou até ser fechado
    });

    try {
      // Extrair texto do arquivo
      const fileExtractor = new FileExtractor();
      const { text } = await fileExtractor.extractTextFromFile(file, setProcessingStep);
      
      setProcessingStep('Analisando transações com IA');
      setProcessingProgress(50);
      toast.loading("Analisando extrações bancárias com IA...", { id: processingToast });
      
      console.log("Enviando texto para análise, tamanho:", text.length);
      
      // Estabelecendo um timeout para a análise da IA
      const timeoutPromise = new Promise<ExtractedTransaction[]>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido ao analisar extrato. Tente novamente.")), 60000);
      });
      
      // Analisar o conteúdo do extrato com a IA com timeout
      const extractionPromise = bankStatementService.extractTransactionsFromContent(text);
      const extractedData = await Promise.race([extractionPromise, timeoutPromise]);
      
      console.log("Dados extraídos recebidos:", extractedData?.length || 0, "transações");
      
      if (!extractedData || extractedData.length === 0) {
        throw new Error("Não foi possível identificar transações no extrato. Tente com outro formato de arquivo.");
      }
      
      // Adicionar propriedade 'selected' para cada transação
      const transactionsWithSelection = extractedData.map(tx => ({ ...tx, selected: true }));
      
      setProcessingProgress(100);
      setExtractedTransactions(transactionsWithSelection);
      setShowConfirmDialog(true);
      
      // Fechar o toast de processamento e mostrar sucesso
      toast.success(`${transactionsWithSelection.length} transações identificadas com sucesso!`, {
        id: processingToast, // Substitui o toast de loading
      });
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      toast.error(error.message || "Erro ao processar arquivo", {
        id: processingToast, // Substitui o toast de loading
      });
    } finally {
      setIsUploading(false);
      setProcessingStep('');
      setProcessingProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleToggleSelection = (index: number) => {
    setExtractedTransactions(prev => 
      prev.map((tx, i) => 
        i === index ? { ...tx, selected: !tx.selected } : tx
      )
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setExtractedTransactions(prev => 
      prev.map(tx => ({ ...tx, selected }))
    );
  };
  
  const handleUpdateCategory = (index: number, newCategory: string) => {
    setExtractedTransactions(prev => 
      prev.map((tx, i) => 
        i === index ? { ...tx, category: newCategory } : tx
      )
    );
  };

  const handleImportTransactions = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep('Importando transações');
      
      // Filtrar apenas as transações selecionadas
      const selectedTransactions = extractedTransactions.filter(tx => tx.selected);
      
      if (selectedTransactions.length === 0) {
        toast.info("Nenhuma transação selecionada para importar");
        setShowConfirmDialog(false);
        return;
      }
      
      console.log(`Iniciando importação de ${selectedTransactions.length} transações`);
      
      // Criar um toast de feedback
      const importToastId = toast.loading(`Importando ${selectedTransactions.length} transações...`);
      
      const result = await bankStatementService.importTransactions(selectedTransactions);
      
      if (result.success) {
        toast.success(`${selectedTransactions.length} transações importadas com sucesso!`, { id: importToastId });
        setShowConfirmDialog(false);
        setExtractedTransactions([]);
        
        // Importante: Garantir que a lista de transações seja atualizada
        onTransactionsAdded();
      } else {
        toast.error(result.message || "Erro ao importar transações", { id: importToastId });
      }
    } catch (error: any) {
      console.error("Erro ao importar transações:", error);
      toast.error(error.message || "Erro ao importar transações");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.txt,.csv,.xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            {processingStep ? processingStep : t('common.processing', 'Processando...')}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {t('transactions.importStatement', 'Importar Extrato')}
          </>
        )}
      </Button>

      <ImportDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        extractedTransactions={extractedTransactions}
        onToggleSelection={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onImport={handleImportTransactions}
        isProcessing={isProcessing}
        onUpdateCategory={handleUpdateCategory}
        processingStep={processingStep}
      />
    </>
  );
};

export default ImportBankStatementButton;
