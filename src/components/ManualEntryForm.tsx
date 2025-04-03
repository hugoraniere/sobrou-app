
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ManualEntryFormProps {
  onExpenseAdded: (expense: {
    id: string;
    date: string;
    amount: number;
    category: string;
    description: string;
  }) => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onExpenseAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error("Please enter an expense");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simple parsing logic (in a real app, this would be more sophisticated)
    try {
      const amountMatch = inputValue.match(/\$?\d+(\.\d+)?/);
      const amount = amountMatch ? parseFloat(amountMatch[0].replace('$', '')) : 0;
      
      // Extract category with some basic logic
      let category = 'Other';
      if (inputValue.toLowerCase().includes('food') || inputValue.toLowerCase().includes('dinner') || 
          inputValue.toLowerCase().includes('lunch') || inputValue.toLowerCase().includes('breakfast')) {
        category = 'Food';
      } else if (inputValue.toLowerCase().includes('transport') || inputValue.toLowerCase().includes('uber') || 
                inputValue.toLowerCase().includes('taxi') || inputValue.toLowerCase().includes('bus')) {
        category = 'Transportation';
      } else if (inputValue.toLowerCase().includes('rent') || inputValue.toLowerCase().includes('mortgage')) {
        category = 'Housing';
      }
      
      // Extract description by removing the amount part
      const description = inputValue.replace(/\$?\d+(\.\d+)?/, '').trim();
      
      // Create expense object
      const expense = {
        id: uuidv4(),
        date: new Date().toISOString(),
        amount,
        category,
        description: description || category
      };
      
      // Call the callback
      onExpenseAdded(expense);
      
      // Reset form and show success message
      setInputValue('');
      toast.success("Expense added successfully!");
    } catch (error) {
      toast.error("Could not parse expense. Try something like 'Spent $30 on lunch'");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Add an expense manually</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. Spent $35 on dinner yesterday"
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-2">
        This simulates sending a message via WhatsApp
      </p>
    </div>
  );
};

export default ManualEntryForm;
