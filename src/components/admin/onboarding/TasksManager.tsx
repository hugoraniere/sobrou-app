import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Settings, Save } from 'lucide-react';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';

interface Task {
  id: string;
  title: string;
  description: string;
  cta_text: string;
  cta_url: string;
  cta_enabled: boolean;
  completion_event: string;
  sort_order: number;
  is_active: boolean;
}

export const TasksManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await OnboardingConfigService.getGetStartedTasks();
      setTasks(data || []);
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (editingTask?.id) {
        // Update existing task
        const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
        setTasks(updatedTasks);
        await OnboardingConfigService.updateGetStartedTasks(updatedTasks);
      } else {
        // Add new task
        const newTask = {
          ...task,
          id: `task_${Date.now()}`,
          sort_order: tasks.length
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await OnboardingConfigService.updateGetStartedTasks(updatedTasks);
      }
      
      toast.success('Tarefa salva com sucesso!');
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Erro ao salvar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      await OnboardingConfigService.updateGetStartedTasks(updatedTasks);
      toast.success('Tarefa removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover tarefa');
    }
  };

  const handleReorderTasks = (dragIndex: number, dropIndex: number) => {
    const draggedTask = tasks[dragIndex];
    const updatedTasks = [...tasks];
    updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(dropIndex, 0, draggedTask);
    
    // Update sort_order
    const reorderedTasks = updatedTasks.map((task, index) => ({
      ...task,
      sort_order: index
    }));
    
    setTasks(reorderedTasks);
    OnboardingConfigService.updateGetStartedTasks(reorderedTasks);
  };

  const openEditDialog = (task?: Task) => {
    setEditingTask(task || {
      id: '',
      title: '',
      description: '',
      cta_text: 'Ir agora',
      cta_url: '',
      cta_enabled: true,
      completion_event: '',
      sort_order: tasks.length,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Tarefas
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure as tarefas que aparecerão no Get Started
            </p>
          </div>
          <Button onClick={() => openEditDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma tarefa configurada</h3>
            <p className="text-muted-foreground mb-4">
              Adicione tarefas para que os usuários vejam no Get Started
            </p>
            <Button onClick={() => openEditDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeira tarefa
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="cursor-move">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{task.title}</h4>
                    {!task.is_active && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {task.cta_enabled ? (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        CTA: {task.cta_text} → {task.cta_url}
                      </span>
                    ) : (
                      <span>CTA desabilitado</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(task)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Task Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTask?.id ? 'Editar Tarefa' : 'Nova Tarefa'}
              </DialogTitle>
            </DialogHeader>
            
            {editingTask && (
              <TaskForm
                task={editingTask}
                onChange={setEditingTask}
                onSave={() => handleSaveTask(editingTask)}
                onCancel={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface TaskFormProps {
  task: Task;
  onChange: (task: Task) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onChange, onSave, onCancel }) => {
  const handleChange = (field: keyof Task, value: any) => {
    onChange({ ...task, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título da Tarefa</Label>
          <Input
            id="title"
            value={task.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ex: Adicionar primeira transação"
          />
        </div>
        
        <div>
          <Label htmlFor="completion_event">Evento de Conclusão</Label>
          <Select
            value={task.completion_event}
            onValueChange={(value) => handleChange('completion_event', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transaction_created">Transação criada</SelectItem>
              <SelectItem value="shopping_list_created">Lista de compras criada</SelectItem>
              <SelectItem value="recipe_created">Receita criada</SelectItem>
              <SelectItem value="bill_created">Conta criada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={task.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ex: Registre sua primeira movimentação financeira"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cta_text">Texto do CTA</Label>
          <Input
            id="cta_text"
            value={task.cta_text}
            onChange={(e) => handleChange('cta_text', e.target.value)}
            placeholder="Ex: Ir agora"
            disabled={!task.cta_enabled}
          />
        </div>
        
        <div>
          <Label htmlFor="cta_url">URL do CTA</Label>
          <Input
            id="cta_url"
            value={task.cta_url}
            onChange={(e) => handleChange('cta_url', e.target.value)}
            placeholder="Ex: /transactions"
            disabled={!task.cta_enabled}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded">
        <div>
          <div className="font-medium">Habilitar CTA</div>
          <div className="text-sm text-muted-foreground">Mostrar botão de ação na tarefa</div>
        </div>
        <Switch
          checked={task.cta_enabled}
          onCheckedChange={(checked) => handleChange('cta_enabled', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 border rounded">
        <div>
          <div className="font-medium">Tarefa Ativa</div>
          <div className="text-sm text-muted-foreground">Exibir esta tarefa no Get Started</div>
        </div>
        <Switch
          checked={task.is_active}
          onCheckedChange={(checked) => handleChange('is_active', checked)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
};