import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Target, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { SavingsService } from '@/services/SavingsService';

interface SavingGoal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
  created_at: string;
  user_id: string;
  completed: boolean;
}

const Goals = () => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [isDeleteGoalDialogOpen, setIsDeleteGoalDialogOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<SavingGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    type: 'poupar',
    initial_amount: '0',
    deadline: ''
  });

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const data = await SavingsService.getSavingGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error(t('goals.fetchError', 'Erro ao carregar metas'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    try {
      await SavingsService.createSavingGoal({
        name: newGoal.name,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.initial_amount) || 0
      });
      
      setNewGoal({
        name: '',
        target_amount: '',
        type: 'poupar',
        initial_amount: '0',
        deadline: ''
      });
      
      setIsNewGoalDialogOpen(false);
      toast.success(t('goals.addSuccess', 'Meta adicionada com sucesso'));
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error(t('goals.addError', 'Erro ao adicionar meta'));
    }
  };

  const handleEditGoal = async () => {
    if (!currentGoal) return;
    
    try {
      await SavingsService.updateSavingGoal(currentGoal.id, {
        name: currentGoal.name,
        target_amount: currentGoal.target_amount,
      });
      
      setIsEditGoalDialogOpen(false);
      toast.success(t('goals.editSuccess', 'Meta atualizada com sucesso'));
      fetchGoals();
    } catch (error) {
      console.error('Error editing goal:', error);
      toast.error(t('goals.editError', 'Erro ao atualizar meta'));
    }
  };

  const handleDeleteGoal = async () => {
    if (!currentGoal) return;
    
    try {
      await SavingsService.deleteSavingGoal(currentGoal.id);
      
      setIsDeleteGoalDialogOpen(false);
      toast.success(t('goals.deleteSuccess', 'Meta excluída com sucesso'));
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error(t('goals.deleteError', 'Erro ao excluir meta'));
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGoalStatus = (goal: SavingGoal) => {
    if (goal.completed) {
      return {
        label: t('goals.completed', 'Concluída'),
        color: 'bg-green-100 text-green-800',
        icon: <Check className="w-4 h-4" />
      };
    }
    
    // In a real app, you'd compare with a deadline
    return {
      label: t('goals.inProgress', 'Em andamento'),
      color: 'bg-blue-100 text-blue-800',
      icon: <Target className="w-4 h-4" />
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('goals.title', 'Metas Financeiras')}</h1>
          <p className="text-gray-600 mt-2">
            {t('goals.subtitle', 'Defina e acompanhe suas metas para uma vida financeira mais organizada')}
          </p>
        </div>
        
        <Dialog open={isNewGoalDialogOpen} onOpenChange={setIsNewGoalDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              {t('goals.addNew', 'Nova Meta')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('goals.addNew', 'Nova Meta')}</DialogTitle>
              <DialogDescription>
                {t('goals.addDescription', 'Preencha os campos para criar uma nova meta financeira')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('goals.name', 'Nome da Meta')}</Label>
                <Input 
                  id="name" 
                  value={newGoal.name} 
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder={t('goals.namePlaceholder', 'Ex: Viagem para a praia')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">{t('goals.type', 'Tipo de Meta')}</Label>
                <Select 
                  value={newGoal.type} 
                  onValueChange={(value) => setNewGoal({...newGoal, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('goals.selectType', 'Selecione o tipo')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('goals.types', 'Tipos de Meta')}</SelectLabel>
                      <SelectItem value="poupar">{t('goals.save', 'Poupar')}</SelectItem>
                      <SelectItem value="quitar">{t('goals.payoff', 'Quitar')}</SelectItem>
                      <SelectItem value="limitar">{t('goals.limit', 'Limitar Gastos')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target_amount">{t('goals.targetAmount', 'Valor Alvo')}</Label>
                <Input 
                  id="target_amount" 
                  type="number"
                  step="0.01"
                  value={newGoal.target_amount} 
                  onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="initial_amount">{t('goals.initialAmount', 'Valor Inicial (opcional)')}</Label>
                <Input 
                  id="initial_amount" 
                  type="number"
                  step="0.01"
                  value={newGoal.initial_amount} 
                  onChange={(e) => setNewGoal({...newGoal, initial_amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="deadline">{t('goals.deadline', 'Data Limite (opcional)')}</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={newGoal.deadline} 
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsNewGoalDialogOpen(false)}
              >
                {t('common.cancel', 'Cancelar')}
              </Button>
              <Button 
                onClick={handleAddGoal}
                disabled={!newGoal.name || !newGoal.target_amount}
              >
                {t('goals.create', 'Criar Meta')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      ) : goals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('goals.noGoals', 'Nenhuma meta encontrada')}</h3>
            <p className="text-gray-500 mb-6">
              {t('goals.startByAdding', 'Comece adicionando sua primeira meta financeira')}
            </p>
            <Button onClick={() => setIsNewGoalDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('goals.addFirst', 'Adicionar Primeira Meta')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {t('goals.progress', 'Você est�� fazendo progresso!')}
                  </h3>
                  <p className="text-blue-800">
                    {goals.some(g => calculateProgress(g.current_amount, g.target_amount) > 50)
                      ? t('goals.nearlyThere', 'Você está mais de 50% mais perto de atingir uma de suas metas. Continue assim!')
                      : t('goals.keepGoing', 'Continue economizando para alcançar suas metas financeiras.')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              const status = getGoalStatus(goal);
              
              return (
                <Card key={goal.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{goal.name}</CardTitle>
                      <div className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${status.color}`}>
                        {status.icon}
                        <span>{status.label}</span>
                      </div>
                    </div>
                    <CardDescription>
                      {`${t('goals.createdOn', 'Criada em')} ${format(new Date(goal.created_at), 'dd/MM/yyyy')}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mt-2">
                      <div className="flex justify-between mb-1 items-baseline">
                        <p className="text-sm text-gray-500">{t('goals.progress', 'Progresso')}</p>
                        <p className="text-sm font-medium">{progress}%</p>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="mt-4 flex justify-between items-baseline">
                      <div>
                        <p className="text-sm text-gray-500">{t('goals.current', 'Valor Atual')}</p>
                        <p className="text-lg font-bold">{formatCurrency(goal.current_amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{t('goals.target', 'Valor Alvo')}</p>
                        <p className="text-lg font-bold">{formatCurrency(goal.target_amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCurrentGoal(goal);
                        setIsEditGoalDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t('common.edit', 'Editar')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setCurrentGoal(goal);
                        setIsDeleteGoalDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('common.delete', 'Excluir')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('goals.edit', 'Editar Meta')}</DialogTitle>
            <DialogDescription>
              {t('goals.editDescription', 'Modifique os detalhes da sua meta financeira')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t('goals.name', 'Nome da Meta')}</Label>
              <Input 
                id="edit-name" 
                value={currentGoal?.name || ''} 
                onChange={(e) => setCurrentGoal(currentGoal ? {...currentGoal, name: e.target.value} : null)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-target">{t('goals.targetAmount', 'Valor Alvo')}</Label>
              <Input 
                id="edit-target" 
                type="number"
                step="0.01"
                value={currentGoal?.target_amount || ''} 
                onChange={(e) => setCurrentGoal(currentGoal ? {...currentGoal, target_amount: parseFloat(e.target.value)} : null)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditGoalDialogOpen(false)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button onClick={handleEditGoal}>
              {t('common.save', 'Salvar Alterações')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteGoalDialogOpen} onOpenChange={setIsDeleteGoalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('goals.confirmDelete', 'Confirmar Exclusão')}</DialogTitle>
            <DialogDescription>
              {t('goals.deleteWarning', 'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  {t('goals.deleteTitle', 'Você está excluindo:')}
                </h3>
                <p className="text-yellow-700 font-medium mt-1">
                  {currentGoal?.name}
                </p>
                <p className="text-yellow-600 text-sm mt-1">
                  {t('goals.progressLost', 'Todo o progresso associado a esta meta será perdido.')}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteGoalDialogOpen(false)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              {t('goals.delete', 'Excluir Meta')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
