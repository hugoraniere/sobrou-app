import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SavingGoal, SavingsService } from '@/services/SavingsService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SavingGoals: React.FC = () => {
  const { t } = useTranslation();
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavingGoals();
  }, []);

  const fetchSavingGoals = async () => {
    setIsLoading(true);
    try {
      const goals = await SavingsService.getSavingGoals();
      setSavingGoals(goals);
    } catch (error) {
      console.error('Error fetching saving goals:', error);
      toast.error("Failed to load saving goals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSavingGoal = async () => {
    if (!newGoalName || !newGoalAmount) {
      toast.error("Please enter both name and amount");
      return;
    }

    const amountValue = parseFloat(newGoalAmount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await SavingsService.createSavingGoal({ name: newGoalName, target_amount: amountValue });
      setNewGoalName('');
      setNewGoalAmount('');
      await fetchSavingGoals();
      toast.success("Saving goal added successfully");
    } catch (error) {
      console.error('Error adding saving goal:', error);
      toast.error("Failed to add saving goal");
    }
  };

  const handleDeleteSavingGoal = async (id: string) => {
    try {
      await SavingsService.deleteSavingGoal(id);
      await fetchSavingGoals();
      toast.success("Saving goal deleted successfully");
    } catch (error) {
      console.error('Error deleting saving goal:', error);
      toast.error("Failed to delete saving goal");
    }
  };

  const handleToggleCompletion = async (id: string, completed: boolean) => {
    try {
      await SavingsService.toggleSavingGoalCompletion(id, !completed);
      await fetchSavingGoals();
      toast.success(`Saving goal ${completed ? 'unmarked as complete' : 'marked as complete'}`);
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error("Failed to toggle completion");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('savingGoals.title', 'Saving Goals')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goalName">{t('savingGoals.name', 'Goal Name')}</Label>
                <Input
                  type="text"
                  id="goalName"
                  placeholder={t('savingGoals.namePlaceholder', 'Enter goal name')}
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="goalAmount">{t('savingGoals.amount', 'Target Amount')}</Label>
                <Input
                  type="number"
                  id="goalAmount"
                  placeholder={t('savingGoals.amountPlaceholder', 'Enter target amount')}
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddSavingGoal}>{t('savingGoals.add', 'Add Goal')}</Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <p>{t('common.loading', 'Loading...')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>{t('savingGoals.tableCaption', 'List of your saving goals.')}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t('savingGoals.name', 'Name')}</TableHead>
                    <TableHead>{t('savingGoals.targetAmount', 'Target Amount')}</TableHead>
                    <TableHead>{t('savingGoals.currentAmount', 'Current Amount')}</TableHead>
                    <TableHead>{t('savingGoals.completed', 'Completed')}</TableHead>
                    <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingGoals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.name}</TableCell>
                      <TableCell>R$ {goal.target_amount.toFixed(2)}</TableCell>
                      <TableCell>R$ {goal.current_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCompletion(goal.id, goal.completed)}
                        >
                          {goal.completed ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t('common.yes', 'Yes')}
                            </>
                          ) : (
                            <>
                              <Circle className="mr-2 h-4 w-4" />
                              {t('common.no', 'No')}
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('common.confirmation', 'Are you absolutely sure?')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('savingGoals.deleteConfirmation', 'This action cannot be undone. Are you sure you want to delete this goal?')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSavingGoal(goal.id)}>{t('common.delete', 'Delete')}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingGoals;
