
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
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Função para confirmar transações em lote
  const handleTransactionsBatchConfirm = useCallback((transactionsToConfirm: any[]) => {
    const processAllTransactions = async () => {
      for (const transaction of transactionsToConfirm) {
        try {
          if (transaction.isSaving && transaction.savingGoal) {
            const goal = await SavingsService.findOrCreateSavingGoal(transaction.savingGoal);
            await SavingsService.addToSavingGoal(goal.id, transaction.amount, transaction.date);
          } else {
            await TransactionService.addTransaction({
              amount: transaction.amount,
              description: transaction.description,
              category: transaction.category,
              type: transaction.type,
              date: transaction.date
            });
          }
        } catch (error) {
          console.error('Error adding transaction:', error);
          toast.error(`Erro ao adicionar transação: ${transaction.description}`);
        }
      }
      
      toast.success(`${transactionsToConfirm.length} transação${transactionsToConfirm.length > 1 ? 'ões' : ''} adicionada${transactionsToConfirm.length > 1 ? 's' : ''} com sucesso!`);
      if (onTransactionAdded) {
        onTransactionAdded(false);
      }
      
      // Reset form
      setInputValue('');
      setUserSelectedCategory(null);
      setShowReview(false);
      setOriginalInputText('');
    };

    processAllTransactions();
  }, [onTransactionAdded]);

  // Hook para gerenciar múltiplas transações
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
    onTransactionsConfirm: handleTransactionsBatchConfirm
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
      // Para prompt de texto, processar e salvar diretamente
      setOriginalInputText(inputValue);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      await processTranscription(inputValue, formattedDate);
      
      // Confirmar automaticamente as transações do texto
      if (hasTransactions) {
        await confirmAllTransactions();
      }
      
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error("Não foi possível processar sua entrada. Por favor, tente novamente.");
    }
  };

  const handleAudioTransactionConfirm = (data: any) => {
    const processTransaction = async (transaction: any) => {
      try {
        const transactionType = transaction.type as 'expense' | 'income';
        
        if (transactionType === 'income') {
          // Create a temporary saving goal for income
          const goal = await SavingsService.findOrCreateSavingGoal("Receita");
          await SavingsService.addToSavingGoal(goal.id, transaction.amount, transaction.date);
          toast.success("Receita adicionada com sucesso!");
          onSavingAdded?.(true);
        } else {
          await TransactionService.addTransaction({
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            type: transactionType,
          });
          toast.success("Transação adicionada com sucesso!");
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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
