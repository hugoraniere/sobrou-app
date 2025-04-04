
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SavingGoal, SavingsService } from '../services/SavingsService';

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
      await SavingsService.addSavingGoal({
        name: newGoalName,
        target_amount: amount
      });
      
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
          {isAddingGoal ? "Cancel" : "Add Goal"}
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
          
          <Button type="submit">Create Saving Goal</Button>
        </form>
      )}
      
      {savingGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {calculateProgress(goal.current_amount, goal.target_amount).toFixed(0)}% complete
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleComplete(goal.id, goal.completed)}
                >
                  {goal.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavingGoals;
