
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TransactionService } from '../services/TransactionService';
import { SavingsService } from '../services/SavingsService';
import { CalendarIcon } from "lucide-react";

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
            category: parsedData.category,
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
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error("Não foi possível processar sua entrada. Por favor, tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 sticky top-4 z-10">
      <h2 className="text-xl font-semibold mb-4">Inserir sua transação</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ex: Gastei R$35 no mercado ontem"
            className="w-full pr-10"
            disabled={isProcessing}
          />
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <Button type="submit" disabled={isProcessing} className="min-w-[100px]">
          {isProcessing ? "Processando..." : "Adicionar"}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-2">
        Experimente: "Recebi R$1500 de salário", ou "Guardei R$100 para férias"
      </p>
    </div>
  );
};

export default AIPromptInput;
