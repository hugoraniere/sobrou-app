
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';
import { usePdfExtractor } from '@/hooks/usePdfExtractor';
import { bankStatementService, ExtractedTransaction } from '@/services/bankStatementService';
import { ConfirmTransactionsDialog } from './upload/ConfirmTransactionsDialog';

interface ImportBankStatementButtonProps {
  onTransactionsAdded: () => void;
}

const ImportBankStatementButton: React.FC<ImportBankStatementButtonProps> = ({ 
  onTransactionsAdded 
}) => {
  const { t } = useTranslation();
  const { extractTextFromPDF } = usePdfExtractor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("Nenhum arquivo selecionado");
      return;
    }

    console.log("Arquivo selecionado:", file.name, "tipo:", file.type, "tamanho:", file.size);
    setIsUploading(true);
    setProcessingStep('Iniciando processamento');
    setProcessingProgress(5);

    try {
      let text = '';
      
      // Processar o arquivo de acordo com seu tipo
      if (file.type === 'application/pdf') {
        setProcessingStep('Extraindo texto do PDF');
        setProcessingProgress(20);
        toast.info("Extraindo texto do PDF, aguarde...");
        console.log("Iniciando extração de texto do PDF");
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setProcessingStep('Lendo conteúdo do arquivo');
        setProcessingProgress(30);
        console.log("Iniciando leitura de arquivo texto");
        text = await readFileAsText(file);
      } else {
        console.error("Formato de arquivo não suportado:", file.type);
        throw new Error("Formato de arquivo não suportado. Por favor, envie PDF, TXT ou CSV.");
      }
      
      if (!text || text.trim().length === 0) {
        console.error("Texto extraído está vazio");
        throw new Error("Não foi possível extrair texto do arquivo. Tente com outro arquivo.");
      }
      
      console.log("Texto extraído do arquivo:", text.substring(0, 100) + "...");
      console.log("Tamanho total do texto:", text.length);
      
      // Verificação mínima para garantir que temos conteúdo suficiente
      if (text.length < 50) {
        console.warn("Texto extraído é muito curto:", text);
        throw new Error("O texto extraído é muito curto para ser um extrato válido. Tente com outro arquivo.");
      }
      
      setProcessingStep('Analisando transações com IA');
      setProcessingProgress(50);
      toast.info("Analisando extrações bancárias com IA...");
      
      console.log("Enviando texto para análise, tamanho:", text.length);
      
      // Analisar o conteúdo do extrato com a IA
      const extractedData = await bankStatementService.extractTransactionsFromContent(text);
      
      console.log("Dados extraídos recebidos:", extractedData?.length || 0, "transações");
      
      if (!extractedData || extractedData.length === 0) {
        throw new Error("Não foi possível identificar transações no extrato. Tente com outro formato de arquivo.");
      }
      
      // Adicionar propriedade 'selected' para cada transação
      const transactionsWithSelection = extractedData.map(tx => ({ ...tx, selected: true }));
      
      setProcessingProgress(100);
      setExtractedTransactions(transactionsWithSelection);
      setShowConfirmDialog(true);
      toast.success(`${transactionsWithSelection.length} transações identificadas com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      toast.error(error.message || "Erro ao processar arquivo");
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
      const result = await bankStatementService.importTransactions(selectedTransactions);
      
      if (result.success) {
        toast.success(`${selectedTransactions.length} transações importadas com sucesso!`);
        setShowConfirmDialog(false);
        setExtractedTransactions([]);
        
        // Importante: Garantir que a lista de transações seja atualizada
        setTimeout(() => {
          onTransactionsAdded();
        }, 300);
      } else {
        toast.error(result.message || "Erro ao importar transações");
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
        accept=".pdf,.txt,.csv"
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

      <ConfirmTransactionsDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        transactions={extractedTransactions}
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
