
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExtractedTransactionsTable } from './ExtractedTransactionsTable';

// Interface para a transação extraída
interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  selected?: boolean;
}

const BankStatementUpload: React.FC<{ onTransactionsAdded: () => void }> = ({ onTransactionsAdded }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Referência para o worker de PDF
  const pdfWorker = useRef<Worker | null>(null);

  // Inicializa o worker do PDF.js (em um ambiente real, precisaríamos carregar a biblioteca PDF.js)
  React.useEffect(() => {
    return () => {
      // Limpar o worker quando o componente for desmontado
      if (pdfWorker.current) {
        pdfWorker.current.terminate();
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      // Para PDFs reais, usaríamos PDF.js, mas para o caso de exercício
      // vamos simular lendo o arquivo como texto
      const text = await readFileAsText(file);
      setFileContent(text);
      
      // Analisar o conteúdo do extrato com a IA
      const extractedData = await extractTransactionsFromContent(text);
      
      // Adicionar propriedade 'selected' para cada transação
      const transactionsWithSelection = extractedData.map(tx => ({ ...tx, selected: true }));
      
      setExtractedTransactions(transactionsWithSelection);
      setShowConfirmDialog(true);
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      toast.error(error.message || "Erro ao processar arquivo");
    } finally {
      setIsUploading(false);
      // Limpar o input para permitir o upload do mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsText(file);
    });
  };

  const extractTransactionsFromContent = async (content: string): Promise<ExtractedTransaction[]> => {
    try {
      const response = await supabase.functions.invoke('parse-bank-statement', {
        body: { textContent: content }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao analisar extrato bancário');
      }

      return response.data.transactions || [];
    } catch (error: any) {
      console.error("Erro ao extrair transações:", error);
      throw new Error(error.message || "Não foi possível extrair transações do extrato");
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
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Converter para o formato de transação do sistema
      const transactionsToInsert = selectedTransactions.map(tx => ({
        user_id: user.id,
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        category: tx.category || 'outros'
      }));

      // Inserir transações no banco
      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (error) {
        throw error;
      }

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
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.txt,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {fileName ? (
              <div className="flex flex-col items-center">
                <FileText className="h-10 w-10 text-blue-500 mb-2" />
                <p className="font-medium">{fileName}</p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFileName(null);
                      setFileContent(null);
                    }}
                    className="mr-2"
                  >
                    {t('common.cancel', 'Cancelar')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-lg font-medium mb-1">
                  {t('transactions.uploadFile', 'Arraste seu arquivo ou clique para selecionar')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t('transactions.supportedFormats', 'PDF, TXT e CSV')}
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 
                    t('common.uploading', 'Enviando...') : 
                    t('transactions.selectFile', 'Selecionar Arquivo')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
                onClick={() => handleSelectAll(true)}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {t('common.selectAll', 'Selecionar Todos')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSelectAll(false)}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                {t('common.deselectAll', 'Desselecionar Todos')}
              </Button>
            </div>
            
            <ExtractedTransactionsTable
              transactions={extractedTransactions}
              onToggleSelection={handleToggleSelection}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button 
              onClick={handleImportTransactions} 
              disabled={isProcessing || !extractedTransactions.some(tx => tx.selected)}
            >
              {isProcessing ? 
                t('common.processing', 'Processando...') : 
                t('transactions.importSelectedTransactions', 'Importar Selecionados')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BankStatementUpload;
