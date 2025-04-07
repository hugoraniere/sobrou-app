
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
      toast.error("Please enter a description of your transaction");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Use AI to parse the text input
      const parsedData = await TransactionService.parseExpenseText(inputValue);
      console.log("Parsed data:", parsedData);
      
      if (parsedData.amount <= 0) {
        toast.error("Could not detect a valid amount. Please include a number in your description.");
        setIsProcessing(false);
        return;
      }
      
      // Handle saving entries differently
      if (parsedData.isSaving && parsedData.savingGoal) {
        // Find or create the saving goal
        const goal = await SavingsService.findOrCreateSavingGoal(parsedData.savingGoal);
        
        // Add money to the goal
        await SavingsService.addToSavingGoal(goal.id, parsedData.amount, parsedData.date);
        
        toast.success(`Added $${parsedData.amount.toFixed(2)} to your ${goal.name} savings!`);
        onSavingAdded();
      } else {
        // Add as a regular transaction
        await TransactionService.addTransaction({
          amount: parsedData.amount,
          description: parsedData.description,
          category: parsedData.category,
          type: parsedData.type as 'expense' | 'income',
          date: parsedData.date,
          is_recurring: parsedData.is_recurring,
          recurrence_interval: parsedData.recurrence_interval
        });
        
        toast.success(
          parsedData.type === 'income' 
            ? `Recorded income of $${parsedData.amount.toFixed(2)}` 
            : `Recorded expense of $${parsedData.amount.toFixed(2)}`
        );
        onTransactionAdded();
      }
      
      // Reset the form
      setInputValue('');
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error("Could not process your input. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 sticky top-4 z-10">
      <h2 className="text-xl font-semibold mb-4">Enter your transaction</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. Spent $35 on groceries yesterday"
            className="w-full pr-10"
            disabled={isProcessing}
          />
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <Button type="submit" disabled={isProcessing} className="min-w-[100px]">
          {isProcessing ? "Processing..." : "Add"}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-2">
        Try: "Received $1500 salary", or "Saved $100 for vacation"
      </p>
    </div>
  );
};

export default AIPromptInput;
