
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TransactionService } from '@/services/transactions';
import { SavingsService } from '@/services/SavingsService';
import { format } from "date-fns";
import { getCategoryByKeyword } from '@/utils/categoryUtils';
import { useTranslation } from 'react-i18next';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

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
    
    setIsProcessing(true);
    
    try {
      // Parseamento local simples para casos comuns, para ser mais rápido
      let quickParsed = false;
      let quickResult = null;
      
      // Tentar detectar um padrão simples no formato "X reais em Y"
      const simplePattern = /(\d+)\s*reais\s*(com|em|no|na|para)\s*(.+)/i;
      const match = inputValue.match(simplePattern);
      
      if (match) {
        const amount = parseInt(match[1], 10);
        const description = match[3];
        const category = detectedCategory || userSelectedCategory || 'compras';
        
        quickResult = {
          amount,
          description,
          category,
          type: 'expense',
          date: format(selectedDate, 'yyyy-MM-dd'),
          isSaving: false
        };
        
        quickParsed = true;
      }
      
      // Se não conseguimos fazer parseamento rápido, usar a API
      const parsedData = quickParsed ? quickResult : await TransactionService.parseExpenseText(inputValue);
      console.log("Parsed data:", parsedData);

      if (!parsedData) {
        throw new Error("Não foi possível interpretar sua transação");
      }

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      parsedData.date = formattedDate;

      if (userSelectedCategory) {
        parsedData.category = userSelectedCategory;
      }
      
      if (!parsedData || parsedData.amount <= 0) {
        toast.error("Não foi possível detectar um valor válido. Por favor, inclua um número na sua descrição.");
        setIsProcessing(false);
        return;
      }

      if (parsedData.isSaving && parsedData.savingGoal) {
        try {
          const goal = await SavingsService.findOrCreateSavingGoal(parsedData.savingGoal);
          await SavingsService.addToSavingGoal(goal.id, parsedData.amount, parsedData.date);
          toast.success(`Adicionado R$${parsedData.amount.toFixed(2)} à sua poupança ${goal.name}!`);
          if (onSavingAdded) {
            onSavingAdded(false); // Não fechar o formulário
          }
        } catch (savingError) {
          console.error('Error processing saving:', savingError);
          toast.error("Não foi possível adicionar à poupança. Por favor, tente novamente.");
        }
      } else {
        try {
          await TransactionService.addTransaction({
            amount: parsedData.amount,
            description: parsedData.description,
            category: parsedData.category || detectedCategory || 'other',
            type: parsedData.type as 'expense' | 'income',
            date: parsedData.date
          });
          toast.success(parsedData.type === 'income' ? `Registrado receita de R$${parsedData.amount.toFixed(2)}` : `Registrado despesa de R$${parsedData.amount.toFixed(2)}`);
          if (onTransactionAdded) {
            onTransactionAdded(false); // Não fechar o formulário
          }
        } catch (transactionError) {
          console.error('Error adding transaction:', transactionError);
          toast.error("Não foi possível adicionar a transação. Por favor, tente novamente.");
        }
      }

      setInputValue('');
      setUserSelectedCategory(null);
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error("Não foi possível processar sua entrada. Por favor, tente novamente.");
    } finally {
      setIsProcessing(false);
    }
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

  const categoryId = userSelectedCategory || detectedCategory;
  
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
        <Button type="submit" disabled={isProcessing} className="min-w-[100px]">
          {isProcessing ? "Processando..." : "Adicionar"}
        </Button>
      </form>
      <PromptExampleFooter selectedDate={selectedDate} />
    </div>
  );
};

export default AIPromptInput;
