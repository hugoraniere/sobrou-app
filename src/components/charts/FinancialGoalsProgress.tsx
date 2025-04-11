
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { SavingGoal, SavingsService } from '@/services/SavingsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface FinancialGoalsProgressProps {
  savingGoals: SavingGoal[];
  chartConfig: Record<string, any>;
}

const FinancialGoalsProgress: React.FC<FinancialGoalsProgressProps> = ({ 
  savingGoals,
  chartConfig 
}) => {
  const { t, i18n } = useTranslation();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  
  // Format currency based on locale
  const formatCurrency = (value: number) => {
    const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  };
  
  // Calculate progress percentage for each goal
  const goalsWithProgress = savingGoals.map(goal => {
    const progressPercent = Math.round((goal.current_amount / goal.target_amount) * 100);
    return {
      ...goal,
      progressPercent
    };
  });

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
      // We should refresh the goals here, but since we don't have a direct callback,
      // the parent component should handle that in the future
    } catch (error) {
      console.error('Error adding saving goal:', error);
      toast.error("Could not create saving goal. Please try again.");
    }
  };

  return (
    <div className="h-[300px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div>
        <Button 
          size="sm" 
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          variant={isAddingGoal ? "outline" : "default"}
        >
          {isAddingGoal ? (
            <X className="h-4 w-4 mr-1" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          {isAddingGoal ? t('common.cancel') : t('dashboard.charts.createGoal')}
        </Button>
      </div>

      {isAddingGoal && (
        <form onSubmit={handleAddGoal} className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="space-y-3">
            <div>
              <Input
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder={t('dashboard.goals.nameInput')}
                className="w-full mb-2"
              />
            </div>
            <div>
              <Input
                type="number"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
                placeholder={t('dashboard.goals.amountInput')}
                min="1"
                step="0.01"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              <Check className="h-4 w-4 mr-2" /> {t('dashboard.goals.create')}
            </Button>
          </div>
        </form>
      )}
      
      {goalsWithProgress.length > 0 ? (
        <div className="space-y-4">
          {goalsWithProgress.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{goal.name}</span>
                <span className="text-sm text-gray-500">
                  {goal.progressPercent}%
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={goal.progressPercent} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <p>{t('dashboard.charts.noGoals')}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialGoalsProgress;
