
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TransactionService } from '../services/TransactionService';
import { SavingsService } from '../services/SavingsService';
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getCategoryByKeyword, transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
  
  // Detectar categoria enquanto digita (mas apenas se o usuário não selecionou uma categoria)
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
  
  // Obter o ícone da categoria detectada ou selecionada
  const categoryId = userSelectedCategory || detectedCategory;
  const categoryInfo = categoryId ? transactionCategories.find(cat => cat.id === categoryId) : null;
  const CategoryIcon = categoryInfo?.icon;
  const categoryName = categoryInfo?.name;
  
  const handleCategorySelect = (categoryId: string) => {
    setUserSelectedCategory(categoryId);
    setIsCategoryPopoverOpen(false);
  };
  
  const resetCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelectedCategory(null);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Inserir sua transação</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ex: Gastei R$35 no mercado ontem"
            className="w-full pr-24"
            disabled={isProcessing}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {categoryId && (
              <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200">
                    {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
                    <span>{categoryName}</span>
                    {userSelectedCategory && (
                      <XCircle className="h-3 w-3 ml-1 text-gray-500 hover:text-gray-700" onClick={resetCategory} />
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="grid gap-1 max-h-60 overflow-y-auto">
                    {transactionCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100
                          ${category.id === categoryId ? 'bg-blue-50 text-blue-600' : ''}
                        `}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {React.createElement(category.icon, { className: "h-4 w-4" })}
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-gray-400 hover:text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button type="submit" disabled={isProcessing} className="min-w-[100px]">
          {isProcessing ? "Processando..." : "Adicionar"}
        </Button>
      </form>
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-500">
          Experimente: "Recebi R$1500 de salário", ou "Guardei R$100 para férias"
        </p>
        <p className="text-sm text-gray-500">
          Data: {format(selectedDate, 'dd/MM/yyyy')}
        </p>
      </div>
    </div>
  );
};

export default AIPromptInput;
