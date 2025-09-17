
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TransactionService } from '@/services/transactions';
import { SavingsService } from '@/services/SavingsService';
import { format } from "date-fns";
import { getCategoryByKeyword } from '@/utils/categoryUtils';
import { useTranslation } from 'react-i18next';
import { AudioRecorderModal } from "@/components/audio/AudioRecorderModal";
import { MultipleTransactionsReview } from '@/components/audio/MultipleTransactionsReview';
import { useMultipleTransactionsParsing } from '@/hooks/useMultipleTransactionsParsing';
import { Mic } from "lucide-react";

// Importing our extracted components
import PromptInputField from './prompt/PromptInputField';
import PromptExampleFooter from './prompt/PromptExampleFooter';

interface AIPromptInputProps {
  onTransactionAdded?: (closeForm?: boolean) => void;
  onSavingAdded?: (closeForm?: boolean) => void;
  className?: string;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({
  onTransactionAdded,
  onSavingAdded,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [originalInputText, setOriginalInputText] = useState('');
  const [hasConfirmedCurrentBatch, setHasConfirmedCurrentBatch] = useState(false);
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Hook para gerenciar múltiplas transações (declarado primeiro)
  const {
    isProcessing,
    transactions,
    error: processingError,
    processTranscription,
    updateTransaction,
    removeTransaction,
    confirmAllTransactions,
    reset: resetProcessing,
    hasTransactions,
    addNewTransaction
  } = useMultipleTransactionsParsing({
    onTransactionsConfirm: async (transactionsToConfirm: any[]) => {
      console.log("🎯 Processando lote de transações:", transactionsToConfirm.length);
      
      try {
        for (const transaction of transactionsToConfirm) {
          try {
            // Corrigir: apenas adicionar a poupança se explicitamente marcado como isSaving
            if (transaction.isSaving && transaction.savingGoal) {
              const goal = await SavingsService.findOrCreateSavingGoal(transaction.savingGoal);
              await SavingsService.addToSavingGoal(goal.id, transaction.amount, transaction.date);
            } else {
              // Tanto receitas quanto despesas vão para transações
              await TransactionService.addTransaction({
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category,
                type: transaction.type, // Agora já normalizado pelo hook
                date: transaction.date
              });
            }
          } catch (error: any) {
            console.error('❌ Error adding transaction:', error);
            const errorMessage = error?.message || 'Erro desconhecido';
            toast.error(`Erro ao adicionar "${transaction.description}": ${errorMessage}`);
            throw error; // Re-throw to stop the whole process
          }
        }
        
        toast.success(`${transactionsToConfirm.length} transação${transactionsToConfirm.length > 1 ? 'ões' : ''} adicionada${transactionsToConfirm.length > 1 ? 's' : ''} com sucesso!`);
        if (onTransactionAdded) {
          onTransactionAdded(false);
        }
        
      } catch (error) {
        console.error("❌ Falha no processamento do lote:", error);
      } finally {
        // SEMPRE limpar o estado, independentemente de sucesso ou falha
        console.log("🧹 Limpando formulário (sucesso ou falha)");
        setInputValue('');
        setUserSelectedCategory(null);
        setDetectedCategory(null);
        setShowReview(false);
        setOriginalInputText('');
        setHasConfirmedCurrentBatch(false);
        resetProcessing();
      }
    }
  });

  // Otimizado para detectar categoria com menos atraso
  const detectCategory = useCallback((text: string) => {
    if (text.trim().length > 3 && !userSelectedCategory) {
      const category = getCategoryByKeyword(text);
      setDetectedCategory(category ? category.id : null);
    } else if (text.trim().length <= 3 && !userSelectedCategory) {
      setDetectedCategory(null);
    }
  }, [userSelectedCategory]);

  // Usando o useEffect com a função de callback otimizada
  useEffect(() => {
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
    }
    
    if (inputValue.trim().length > 0) {
      // Reduzindo o timeout para melhorar a responsividade
      inputTimeoutRef.current = setTimeout(() => {
        detectCategory(inputValue);
      }, 200);
    }
    
    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [inputValue, detectCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error("Por favor, descreva sua transação");
      return;
    }
    
    try {
      console.log("🚀 Iniciando processamento do prompt:", inputValue);
      setOriginalInputText(inputValue);
      setHasConfirmedCurrentBatch(false); // Reset do flag ao iniciar novo processamento
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Aguardar o processamento completo
      await processTranscription(inputValue, formattedDate);
      
    } catch (error: any) {
      console.error('❌ Error processing input:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      toast.error(`Não foi possível processar sua entrada: ${errorMessage}`);
      
      // Reset em caso de erro também
      setHasConfirmedCurrentBatch(false);
    }
  };

  // UseEffect para monitorar mudanças nas transações e confirmar automaticamente
  useEffect(() => {
    console.log("🔍 Verificando transações no useEffect:", {
      transactionsCount: transactions.length,
      isProcessing,
      hasConfirmedCurrentBatch
    });
    
    // Só confirmar se temos transações, não estamos processando e ainda não confirmamos este lote
    if (transactions.length > 0 && !isProcessing && !hasConfirmedCurrentBatch) {
      console.log("✅ Confirmando transações automaticamente");
      setHasConfirmedCurrentBatch(true); // Marcar como confirmado ANTES de chamar
      confirmAllTransactions();
    }
  }, [transactions, isProcessing, hasConfirmedCurrentBatch, confirmAllTransactions]);

  const handleAudioTransactionConfirm = (data: any) => {
    const processTransaction = async (transaction: any) => {
      try {
        const transactionType = transaction.type as 'expense' | 'income';
        
        // Corrigir: receitas devem ser adicionadas como transações, não como poupança
        // a menos que explicitamente marcadas como isSaving
        if (transaction.isSaving && transaction.savingGoal) {
          const goal = await SavingsService.findOrCreateSavingGoal(transaction.savingGoal);
          await SavingsService.addToSavingGoal(goal.id, transaction.amount, transaction.date);
          toast.success("Valor adicionado à meta de economia!");
          onSavingAdded?.(true);
        } else {
          // Tanto receitas quanto despesas vão para transações
          await TransactionService.addTransaction({
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            type: transactionType,
          });
          const typeText = transactionType === 'income' ? 'Receita' : 'Despesa';
          toast.success(`${typeText} adicionada com sucesso!`);
          onTransactionAdded?.(true);
        }
      } catch (error) {
        console.error('Error adding audio transaction:', error);
        toast.error("Erro ao adicionar transação");
      }
    };

    const processAllTransactions = async () => {
      if (Array.isArray(data)) {
        // Process multiple transactions
        for (const transaction of data) {
          await processTransaction(transaction);
        }
        toast.success(`${data.length} transações adicionadas com sucesso!`);
      } else {
        // Process single transaction
        await processTransaction(data);
      }
      
      // Reset form
      setInputValue("");
      setDetectedCategory(null);
      setUserSelectedCategory(null);
      setSelectedDate(new Date());
      setAudioModalOpen(false);
    };

    processAllTransactions();
  };

  const handleCategorySelect = (categoryId: string) => {
    setUserSelectedCategory(categoryId);
    setIsCategoryPopoverOpen(false);
  };

  const resetCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelectedCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBackFromReview = () => {
    setShowReview(false);
    resetProcessing();
  };

  const categoryId = userSelectedCategory || detectedCategory;
  
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" data-tour-id="transactions.ai.prompt-input">
        <div className="flex-1">
          <PromptInputField
          inputValue={inputValue} 
          onInputChange={handleInputChange} 
          categoryId={categoryId} 
          userSelectedCategory={userSelectedCategory} 
          isCategoryPopoverOpen={isCategoryPopoverOpen} 
          setIsCategoryPopoverOpen={setIsCategoryPopoverOpen} 
          handleCategorySelect={handleCategorySelect} 
          resetCategory={resetCategory} 
          selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            isProcessing={isProcessing} 
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setAudioModalOpen(true)}
            disabled={isProcessing}
            className="shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button type="submit" disabled={isProcessing} className="w-auto px-4">
            {isProcessing ? "Processando..." : "Adicionar"}
          </Button>
        </div>
      </form>
      
      <PromptExampleFooter selectedDate={selectedDate} />

      <AudioRecorderModal
        open={audioModalOpen}
        onOpenChange={setAudioModalOpen}
        onTransactionConfirm={handleAudioTransactionConfirm}
      />
    </div>
  );
};

export default AIPromptInput;
