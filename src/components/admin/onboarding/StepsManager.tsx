import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical,
  Save
} from 'lucide-react';
import { OnboardingStep } from '@/types/onboarding';
import { OnboardingService } from '@/services/OnboardingService';

export const StepsManager: React.FC = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<OnboardingStep | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    description: '',
    icon: '',
    action_path: '',
    action_hint: '',
    completion_event: '',
    target_count: 1,
    sort_order: 0,
    active: true
  });

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    setLoading(true);
    try {
      const data = await OnboardingService.getSteps();
      setSteps(data);
    } catch (error) {
      toast.error('Erro ao carregar passos do onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep = async () => {
    try {
      if (editingStep) {
        // Update existing step
        const updated = await OnboardingService.updateStep(editingStep.id, formData);
        if (updated) {
          setSteps(steps.map(s => s.id === editingStep.id ? updated : s));
          toast.success('Passo atualizado com sucesso');
        }
      } else {
        // Create new step
        const created = await OnboardingService.createStep(formData);
        if (created) {
          setSteps([...steps, created]);
          toast.success('Passo criado com sucesso');
        }
      }
      
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar passo');
    }
  };

  const handleDeleteStep = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este passo?')) {
      try {
        const success = await OnboardingService.deleteStep(id);
        if (success) {
          setSteps(steps.filter(s => s.id !== id));
          toast.success('Passo excluído com sucesso');
        }
      } catch (error) {
        toast.error('Erro ao excluir passo');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      title: '',
      description: '',
      icon: '',
      action_path: '',
      action_hint: '',
      completion_event: '',
      target_count: 1,
      sort_order: Math.max(...steps.map(s => s.sort_order), 0) + 10,
      active: true
    });
    setEditingStep(null);
    setIsCreateDialogOpen(false);
  };

  const openEditDialog = (step: OnboardingStep) => {
    setEditingStep(step);
    setFormData({
      key: step.key,
      title: step.title,
      description: step.description,
      icon: step.icon || '',
      action_path: step.action_path,
      action_hint: step.action_hint || '',
      completion_event: step.completion_event,
      target_count: step.target_count,
      sort_order: step.sort_order,
      active: step.active
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Passos do Onboarding</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Passo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Caminho</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{step.key}</TableCell>
                  <TableCell className="font-medium">{step.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{step.description}</TableCell>
                  <TableCell className="font-mono text-sm">{step.action_path}</TableCell>
                  <TableCell className="font-mono text-sm">{step.completion_event}</TableCell>
                  <TableCell>{step.target_count}</TableCell>
                  <TableCell>
                    <Badge variant={step.active ? "default" : "secondary"}>
                      {step.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(step)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create/Edit Step Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStep ? 'Editar Passo' : 'Novo Passo'}
            </DialogTitle>
            <DialogDescription>
              Configure as informações do passo do onboarding
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="key">Chave *</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({...formData, key: e.target.value})}
                placeholder="add_transaction"
              />
            </div>
            
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Registre 1 transação"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Adicione sua primeira despesa e veja os gráficos."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="action_path">Caminho da Ação *</Label>
              <Input
                id="action_path"
                value={formData.action_path}
                onChange={(e) => setFormData({...formData, action_path: e.target.value})}
                placeholder="/transacoes"
              />
            </div>
            
            <div>
              <Label htmlFor="completion_event">Evento de Conclusão *</Label>
              <Input
                id="completion_event"
                value={formData.completion_event}
                onChange={(e) => setFormData({...formData, completion_event: e.target.value})}
                placeholder="transaction_created"
              />
            </div>
            
            <div>
              <Label htmlFor="target_count">Meta</Label>
              <Input
                id="target_count"
                type="number"
                value={formData.target_count}
                onChange={(e) => setFormData({...formData, target_count: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="md:col-span-2 flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
              <Label htmlFor="active">Passo ativo</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStep}>
              <Save className="w-4 h-4 mr-2" />
              {editingStep ? 'Atualizar' : 'Criar'} Passo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};