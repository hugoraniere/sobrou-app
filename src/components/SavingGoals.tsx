
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SavingGoal, SavingsService } from '../services/SavingsService';
import { Plus, Check, X, PiggyBank } from "lucide-react";

interface SavingGoalsProps {
  savingGoals: SavingGoal[];
  onGoalAdded: () => void;
  onGoalUpdated: () => void;
}

const SavingGoals: React.FC<SavingGoalsProps> = ({ 
  savingGoals,
  onGoalAdded,
  onGoalUpdated
}) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [isAddingToGoal, setIsAddingToGoal] = useState<string | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoalName.trim()) {
      toast.error("Please enter a name for your saving goal");
      return;
    }
    
    const amount = parseFloat(newGoalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }
    
    try {
      await SavingsService.createSavingGoal(newGoalName, amount);
      
      toast.success(`Created new saving goal: ${newGoalName}`);
      setNewGoalName('');
      setNewGoalAmount('');
      setIsAddingGoal(false);
      onGoalAdded();
    } catch (error) {
      console.error('Error adding saving goal:', error);
      toast.error("Could not create saving goal. Please try again.");
    }
  };
  
  const handleAddToGoal = async (goalId: string) => {
    if (!amountToAdd) {
      toast.error("Please enter an amount to add");
      return;
    }
    
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      await SavingsService.addToSavingGoal(goalId, amount, new Date().toISOString().split('T')[0]);
      toast.success(`Added $${amount.toFixed(2)} to your savings!`);
      setIsAddingToGoal(null);
      setAmountToAdd('');
      onGoalUpdated();
    } catch (error) {
      console.error('Error adding to goal:', error);
      toast.error("Could not add to savings goal. Please try again.");
    }
  };
  
  const handleToggleComplete = async (goalId: string, currentStatus: boolean) => {
    try {
      await SavingsService.toggleSavingGoalCompletion(goalId, !currentStatus);
      onGoalUpdated();
      toast.success(`Goal marked as ${!currentStatus ? 'complete' : 'incomplete'}`);
    } catch (error) {
      console.error('Error toggling goal completion:', error);
      toast.error("Could not update goal status. Please try again.");
    }
  };
  
  const calculateProgress = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Saving Goals</h3>
        <Button 
          size="sm" 
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          variant={isAddingGoal ? "outline" : "default"}
        >
          {isAddingGoal ? "Cancel" : (
            <>
              <Plus className="mr-1 h-4 w-4" /> Add Goal
            </>
          )}
        </Button>
      </div>
      
      {isAddingGoal && (
        <form onSubmit={handleAddGoal} className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <Input
              id="goalName"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g. Vacation Fund"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount
            </label>
            <Input
              id="goalAmount"
              type="number"
              value={newGoalAmount}
              onChange={(e) => setNewGoalAmount(e.target.value)}
              placeholder="e.g. 1000"
              min="1"
              step="1"
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full">Create Saving Goal</Button>
        </form>
      )}
      
      {savingGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <PiggyBank className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">You don't have any saving goals yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Create a goal or try saying "Saved $100 for vacation"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savingGoals.map((goal) => (
            <div 
              key={goal.id} 
              className={`p-4 border rounded-lg ${
                goal.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <h4 className="font-medium">{goal.name}</h4>
                <div className="text-sm text-gray-600">
                  ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}
                </div>
              </div>
              
              <Progress value={calculateProgress(goal.current_amount, goal.target_amount)} className="h-2 mb-3" />
              
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="text-sm text-gray-500">
                  {calculateProgress(goal.current_amount, goal.target_amount).toFixed(0)}% complete
                </div>
                
                <div className="flex space-x-2">
                  {isAddingToGoal === goal.id ? (
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="Amount"
                        className="w-24 h-8 text-sm"
                        min="1"
                        step="1"
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleAddToGoal(goal.id)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setIsAddingToGoal(null)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddingToGoal(goal.id)}
                    >
                      Add to Goal
                    </Button>
                  )}
                  
                  <Button 
                    variant={goal.completed ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleComplete(goal.id, goal.completed)}
                  >
                    {goal.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavingGoals;
