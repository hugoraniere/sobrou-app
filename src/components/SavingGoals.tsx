
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SavingGoal, SavingsService } from '@/services/SavingsService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from 'sonner';
import { PlusCircle, CheckCircle, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SavingGoalsProps {
  savingGoals: SavingGoal[];
  onGoalAdded: () => void;
  onGoalUpdated: () => void;
}

const SavingGoals: React.FC<SavingGoalsProps> = ({ savingGoals, onGoalAdded, onGoalUpdated }) => {
  const { t } = useTranslation();
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<SavingGoal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddGoal = async () => {
    if (!newGoalName || !newGoalAmount) {
      toast.error(t('savingGoals.missingFields', 'Por favor, preencha todos os campos.'));
      return;
    }

    try {
      await SavingsService.createSavingGoal({
        name: newGoalName,
        target_amount: parseFloat(newGoalAmount),
        current_amount: 0,
      });
      toast.success(t('savingGoals.goalCreated', 'Meta de economia criada com sucesso!'));
      setNewGoalName('');
      setNewGoalAmount('');
      setIsAddingGoal(false);
      onGoalAdded();
    } catch (error) {
      console.error('Error creating saving goal:', error);
      toast.error(t('savingGoals.goalCreationFailed', 'Falha ao criar meta de economia.'));
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    try {
      await SavingsService.deleteSavingGoal(goalToDelete.id);
      toast.success(t('savingGoals.goalDeleted', 'Meta de economia excluída com sucesso!'));
      setGoalToDelete(null);
      setIsDeleteDialogOpen(false);
      onGoalUpdated();
    } catch (error) {
      console.error('Error deleting saving goal:', error);
      toast.error(t('savingGoals.goalDeletionFailed', 'Falha ao excluir meta de economia.'));
    }
  };

  // Calculate percentage for progress bar
  const calculatePercentage = (current: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('savingGoals.title', 'Metas de Economia')}</CardTitle>
        <CardDescription>{t('savingGoals.subtitle', 'Acompanhe suas metas financeiras')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savingGoals.length > 0 ? (
          <div className="h-[220px] overflow-y-auto space-y-4">
            {savingGoals.map((goal) => (
              <div key={goal.id} className="space-y-2 border-b pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setGoalToDelete(goal);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">
                    R$ {goal.current_amount} / R$ {goal.target_amount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {calculatePercentage(goal.current_amount, goal.target_amount)}%
                  </span>
                </div>
                <Progress 
                  value={calculatePercentage(goal.current_amount, goal.target_amount)} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        ) : (
          <p>{t('savingGoals.noGoals', 'Nenhuma meta de economia adicionada ainda.')}</p>
        )}

        {isAddingGoal ? (
          <div className="grid gap-2">
            <Label htmlFor="goal-name">{t('savingGoals.goalName', 'Nome da Meta')}</Label>
            <Input
              id="goal-name"
              placeholder={t('savingGoals.goalNamePlaceholder', 'Ex: Carro novo')}
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
            />
            <Label htmlFor="goal-amount">{t('savingGoals.goalAmount', 'Valor da Meta')}</Label>
            <Input
              id="goal-amount"
              placeholder={t('savingGoals.goalAmountPlaceholder', 'Ex: 20000')}
              type="number"
              value={newGoalAmount}
              onChange={(e) => setNewGoalAmount(e.target.value)}
            />
            <Button onClick={handleAddGoal}>{t('savingGoals.addGoal', 'Adicionar Meta')}</Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsAddingGoal(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('savingGoals.addGoalButton', 'Adicionar Nova Meta')}
          </Button>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('savingGoals.deleteConfirmationTitle', 'Excluir Meta')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('savingGoals.deleteConfirmationDescription', 'Tem certeza de que deseja excluir esta meta? Esta ação não pode ser desfeita.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setGoalToDelete(null);
            }}>
              {t('common.cancel', 'Cancelar')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal}>
              {t('savingGoals.delete', 'Excluir')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SavingGoals;
