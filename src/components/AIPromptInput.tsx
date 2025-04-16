
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TransactionService } from '../services/TransactionService';
import { SavingsService } from '../services/SavingsService';
import { format } from "date-fns";
import { getCategoryByKeyword } from '@/data/categories';
import { useTranslation } from 'react-i18next';

// Importing our extracted components
import PromptInputField from './prompt/PromptInputField';
import PromptExampleFooter from './prompt/PromptExampleFooter';

interface AIPromptInputProps {
  onTransactionAdded: () => void;
  onSavingAdded: () => void;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({ 
  onTransactionAdded, 
  onSavingAdded 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  
  // Detect category as user types (only if no manually selected category)
  useEffect(() => {
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
    }
    
    if (inputValue.trim().length > 3 && !userSelectedCategory) {
      inputTimeoutRef.current = setTimeout(() => {
        const category = getCategoryByKeyword(inputValue);
        setDetectedCategory(category ? category.id : null);
      }, 500);
    } else if (inputValue.trim().length <= 3 && !userSelectedCategory) {
      setDetectedCategory(null);
    }
    
    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [inputValue, userSelectedCategory]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error("Por favor, descreva sua transação");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Use AI to parse the text input
      const parsedData = await TransactionService.parseExpenseText(inputValue);
      console.log("Parsed data:", parsedData);
      
      // Use the selected date from the datepicker
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      parsedData.date = formattedDate;
      
      // Use user selected category if available
      if (userSelectedCategory) {
        parsedData.category = userSelectedCategory;
      }
      
      if (!parsedData || parsedData.amount <= 0) {
        toast.error("Não foi possível detectar um valor válido. Por favor, inclua um número na sua descrição.");
        setIsProcessing(false);
        return;
      }
      
      // Handle saving entries differently
      if (parsedData.isSaving && parsedData.savingGoal) {
        try {
          // Find or create the saving goal
          const goal = await SavingsService.findOrCreateSavingGoal(parsedData.savingGoal);
          
          // Add money to the goal
          await SavingsService.addToSavingGoal(goal.id, parsedData.amount, parsedData.date);
          
          toast.success(`Adicionado R$${parsedData.amount.toFixed(2)} à sua poupança ${goal.name}!`);
          onSavingAdded();
        } catch (savingError) {
          console.error('Error processing saving:', savingError);
          toast.error("Não foi possível adicionar à poupança. Por favor, tente novamente.");
        }
      } else {
        try {
          // Add as a regular transaction - removing unsupported fields
          await TransactionService.addTransaction({
            amount: parsedData.amount,
            description: parsedData.description,
            category: parsedData.category || (detectedCategory || 'other'),
            type: parsedData.type as 'expense' | 'income',
            date: parsedData.date
          });
          
          toast.success(
            parsedData.type === 'income' 
              ? `Registrado receita de R$${parsedData.amount.toFixed(2)}` 
              : `Registrado despesa de R$${parsedData.amount.toFixed(2)}`
          );
          onTransactionAdded();
        } catch (transactionError) {
          console.error('Error adding transaction:', transactionError);
          toast.error("Não foi possível adicionar a transação. Por favor, tente novamente.");
        }
      }
      
      // Reset the form
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
  
  // Get the effective category ID (user selected or auto-detected)
  const categoryId = userSelectedCategory || detectedCategory;
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Inserir sua transação</h2>
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
