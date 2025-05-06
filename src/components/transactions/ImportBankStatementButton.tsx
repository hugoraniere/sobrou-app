
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
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
    if (!file) return;

    setIsUploading(true);

    try {
      let text = '';
      
      // Processar o arquivo de acordo com seu tipo
      if (file.type === 'application/pdf') {
        toast.info("Extraindo texto do PDF, aguarde...");
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain' || file.type === 'text/csv') {
        text = await readFileAsText(file);
      } else {
        throw new Error("Formato de arquivo não suportado. Por favor, envie PDF, TXT ou CSV.");
      }
      
      if (!text || text.trim().length === 0) {
        throw new Error("Não foi possível extrair texto do arquivo. Tente com outro arquivo.");
      }
      
      toast.info("Analisando extrações bancárias com IA...");
      
      // Analisar o conteúdo do extrato com a IA
      const extractedData = await bankStatementService.extractTransactionsFromContent(text);
      
      if (!extractedData || extractedData.length === 0) {
        throw new Error("Não foi possível identificar transações no extrato. Tente com outro formato de arquivo.");
      }
      
      // Adicionar propriedade 'selected' para cada transação
      const transactionsWithSelection = extractedData.map(tx => ({ ...tx, selected: true }));
      
      setExtractedTransactions(transactionsWithSelection);
      setShowConfirmDialog(true);
      toast.success("Extrato analisado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      toast.error(error.message || "Erro ao processar arquivo");
    } finally {
      setIsUploading(false);
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
      
      // Filtrar apenas as transações selecionadas
      const selectedTransactions = extractedTransactions.filter(tx => tx.selected);
      
      if (selectedTransactions.length === 0) {
        toast.info("Nenhuma transação selecionada para importar");
        setShowConfirmDialog(false);
        return;
      }
      
      await bankStatementService.importTransactions(selectedTransactions);

      toast.success(`${selectedTransactions.length} transações importadas com sucesso!`);
      setShowConfirmDialog(false);
      onTransactionsAdded(); // Atualizar lista de transações
      
    } catch (error: any) {
      console.error("Erro ao importar transações:", error);
      toast.error(error.message || "Erro ao importar transações");
    } finally {
      setIsProcessing(false);
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
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            {t('common.processing', 'Processando...')}
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
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
      />
    </>
  );
};

export default ImportBankStatementButton;
