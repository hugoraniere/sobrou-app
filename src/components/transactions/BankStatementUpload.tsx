
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploadArea } from './upload/FileUploadArea';
import { ConfirmTransactionsDialog } from './upload/ConfirmTransactionsDialog';
import { usePdfExtractor } from '@/hooks/usePdfExtractor';
import { bankStatementService, ExtractedTransaction } from '@/services/bankStatementService';

const BankStatementUpload: React.FC<{ onTransactionsAdded: () => void }> = ({ onTransactionsAdded }) => {
  const { t } = useTranslation();
  const { extractTextFromPDF } = usePdfExtractor();
  
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
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

    setFileName(file.name);
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
      
      setFileContent(text);
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('transactions.uploadStatement', 'Importar Extrato Bancário')}
          </CardTitle>
          <CardDescription>
            {t('transactions.uploadStatementDesc', 'Faça upload de um extrato bancário para importar transações automaticamente')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadArea 
            fileName={fileName}
            isUploading={isUploading}
            onFileSelect={handleFileChange}
            onCancel={() => {
              setFileName(null);
              setFileContent(null);
            }}
          />
        </CardContent>
      </Card>

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

export default BankStatementUpload;
