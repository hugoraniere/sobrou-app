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
      // Only pass the name to createSavingGoal, the amount will be zero by default
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('savingGoals.title', 'Metas de Economia')}</CardTitle>
        <CardDescription>{t('savingGoals.subtitle', 'Acompanhe suas metas financeiras')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savingGoals.length > 0 ? (
          <ul className="list-none space-y-2">
            {savingGoals.map((goal) => (
              <li key={goal.id} className="flex items-center justify-between border rounded-md p-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>{goal.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>R$ {goal.current_amount} / R$ {goal.target_amount}</span>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setGoalToDelete(goal);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
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
