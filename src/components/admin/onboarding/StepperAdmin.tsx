import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Palette, 
  Plus,
  Edit,
  Trash2,
  GripVertical,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingStep } from '@/types/onboarding';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useOnboardingAdmin, useVirtualization } from '@/hooks/useOnboardingAdmin';

export const StepperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [stepperConfig, setStepperConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<OnboardingStep | null>(null);
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  
  const { debouncedSave } = useOnboardingAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stepsData, configData] = await Promise.all([
        fetchSteps(),
        OnboardingConfigService.getStepperConfig()
      ]);
      setSteps(stepsData);
      setStepperConfig(configData);
    } catch (error) {
      toast.error('Erro ao carregar dados do Stepper');
    }
    setIsLoading(false);
  };

  const fetchSteps = async (): Promise<OnboardingStep[]> => {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .order('sort_order');

    if (error) throw error;
    return data || [];
  };

  const handleConfigUpdate = useCallback(async (updates: any) => {
    if (!stepperConfig) return;
    
    // Optimistic update
    const updatedConfig = { ...stepperConfig, ...updates };
    setStepperConfig(updatedConfig);
    
    // Debounced save
    debouncedSave(async () => {
      const success = await OnboardingConfigService.updateConfig('get_started_stepper', {
        content: updatedConfig
      });
      
      if (!success) {
        setStepperConfig(stepperConfig);
        throw new Error('Falha ao atualizar configuração');
      }
    });
  }, [stepperConfig, debouncedSave]);

  const handleStepSave = async (stepData: Partial<OnboardingStep>) => {
    let success = false;
    
    if (editingStep) {
      const { error } = await supabase
        .from('onboarding_steps')
        .update(stepData)
        .eq('id', editingStep.id);
      
      success = !error;
      if (success) {
        setSteps(prev => prev.map(s => s.id === editingStep.id ? { ...s, ...stepData } as OnboardingStep : s));
      }
    } else {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .insert({
          key: stepData.key || 'new-step',
          title: stepData.title || 'Novo Passo',
          description: stepData.description || '',
          action_path: stepData.action_path || '/',
          completion_event: stepData.completion_event || 'step_completed',
          ...stepData,
          sort_order: steps.length,
          active: true
        })
        .select()
        .single();
      
      success = !error;
      if (success && data) {
        setSteps(prev => [...prev, data]);
      }
    }

    if (success) {
      toast.success(editingStep ? 'Passo atualizado' : 'Passo criado');
      setEditingStep(null);
      setIsCreatingStep(false);
    } else {
      toast.error('Erro ao salvar passo');
    }
  };

  const handleStepDelete = async (stepId: number) => {
    const { error } = await supabase
      .from('onboarding_steps')
      .delete()
      .eq('id', stepId);

    if (!error) {
      setSteps(prev => prev.filter(s => s.id !== stepId));
      toast.success('Passo removido');
    } else {
      toast.error('Erro ao remover passo');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSteps(items);
    
    // Update sort_order for all items
    const updates = items.map((step, index) => 
      supabase
        .from('onboarding_steps')
        .update({ sort_order: index })
        .eq('id', step.id)
    );

    await Promise.all(updates);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="steps" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Passos
          </TabsTrigger>
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Visibilidade
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Comportamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <StepperGeneralSettings config={stepperConfig} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <StepperStepsManager 
            steps={steps}
            onEdit={setEditingStep}
            onDelete={handleStepDelete}
            onDragEnd={handleDragEnd}
            onCreateNew={() => setIsCreatingStep(true)}
          />
        </TabsContent>

        <TabsContent value="visibility" className="space-y-4">
          <StepperVisibilitySettings config={stepperConfig} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <StepperAppearanceSettings config={stepperConfig} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <StepperBehaviorSettings config={stepperConfig} onUpdate={handleConfigUpdate} />
        </TabsContent>
      </Tabs>

      {/* Step Editor Modal */}
      {(editingStep || isCreatingStep) && (
        <StepperStepEditor
          step={editingStep}
          onSave={handleStepSave}
          onClose={() => {
            setEditingStep(null);
            setIsCreatingStep(false);
          }}
        />
      )}
    </div>
  );
};

const StepperGeneralSettings: React.FC<{
  config: any;
  onUpdate: (updates: any) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais do Stepper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="stepper-title">Título do Stepper</Label>
          <Input
            id="stepper-title"
            value={config.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Primeiros Passos"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="completion-message">Mensagem de Conclusão</Label>
          <Textarea
            id="completion-message"
            value={config.completion_message || ''}
            onChange={(e) => onUpdate({ completion_message: e.target.value })}
            placeholder="Parabéns! Você concluiu todos os passos."
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Mostrar Progresso</Label>
            <p className="text-sm text-muted-foreground">Exibir barra de progresso</p>
          </div>
          <Switch
            checked={config.show_progress ?? true}
            onCheckedChange={(checked) => onUpdate({ show_progress: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Permitir Minimizar</Label>
            <p className="text-sm text-muted-foreground">Mostrar opção para minimizar o stepper</p>
          </div>
          <Switch
            checked={config.show_minimize ?? true}
            onCheckedChange={(checked) => onUpdate({ show_minimize: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StepperStepsManager: React.FC<{
  steps: OnboardingStep[];
  onEdit: (step: OnboardingStep) => void;
  onDelete: (stepId: number) => void;
  onDragEnd: (result: any) => void;
  onCreateNew: () => void;
}> = ({ steps, onEdit, onDelete, onDragEnd, onCreateNew }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Passos do Stepper</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Passo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="stepper-steps">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {steps.map((step, index) => (
                  <Draggable key={step.id.toString()} draggableId={step.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-3 border rounded-lg bg-card"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium">{step.title}</div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                          <div className="text-xs text-muted-foreground">
                            Evento: {step.completion_event} | Caminho: {step.action_path}
                          </div>
                        </div>
                        
                        <Badge variant={step.active ? "default" : "secondary"}>
                          {step.active ? "Ativo" : "Inativo"}
                        </Badge>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(step)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(step.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

const StepperVisibilitySettings: React.FC<{
  config: any;
  onUpdate: (updates: any) => void;
}> = ({ config, onUpdate }) => {
  const visibilityRules = config?.visibility_rules || { show_on: 'first_access', target_users: 'all' };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Visibilidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Quando mostrar</Label>
          <Select
            value={visibilityRules.show_on}
            onValueChange={(value) => 
              onUpdate({ 
                visibility_rules: { 
                  ...visibilityRules, 
                  show_on: value 
                } 
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_access">Apenas no primeiro acesso</SelectItem>
              <SelectItem value="until_completion">Até completar o onboarding</SelectItem>
              <SelectItem value="never_show_again">Marca ativo botão "Não ver mais"</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label>Usuários alvo</Label>
          <Select
            value={visibilityRules.target_users}
            onValueChange={(value) => 
              onUpdate({ 
                visibility_rules: { 
                  ...visibilityRules, 
                  target_users: value 
                } 
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              <SelectItem value="new_users">Apenas novos usuários</SelectItem>
              <SelectItem value="existing_users">Apenas usuários existentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Sincronizar com Product Tour</Label>
            <p className="text-sm text-muted-foreground">Usar as mesmas configurações do Product Tour</p>
          </div>
          <Switch
            checked={config.sync_with_product_tour ?? false}
            onCheckedChange={(checked) => onUpdate({ sync_with_product_tour: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StepperAppearanceSettings: React.FC<{
  config: any;
  onUpdate: (updates: any) => void;
}> = ({ config, onUpdate }) => {
  const colors = config?.colors || { primary: '#10b981', background: '#ffffff', text: '#374151' };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização Visual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="stepper-primary-color">Cor Primária</Label>
            <Input
              id="stepper-primary-color"
              type="color"
              value={colors.primary}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...colors, 
                    primary: e.target.value 
                  } 
                })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="stepper-background-color">Cor de Fundo</Label>
            <Input
              id="stepper-background-color"
              type="color"
              value={colors.background}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...colors, 
                    background: e.target.value 
                  } 
                })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="stepper-text-color">Cor do Texto</Label>
            <Input
              id="stepper-text-color"
              type="color"
              value={colors.text}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...colors, 
                    text: e.target.value 
                  } 
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StepperBehaviorSettings: React.FC<{
  config: any;
  onUpdate: (updates: any) => void;
}> = ({ config, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Comportamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Pode ser fechado</Label>
            <p className="text-sm text-muted-foreground">Permitir que o usuário feche o stepper</p>
          </div>
          <Switch
            checked={config.can_be_closed ?? true}
            onCheckedChange={(checked) => onUpdate({ can_be_closed: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-completar passos</Label>
            <p className="text-sm text-muted-foreground">Marcar passos como completos automaticamente</p>
          </div>
          <Switch
            checked={config.auto_complete ?? true}
            onCheckedChange={(checked) => onUpdate({ auto_complete: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Mostrar celebração</Label>
            <p className="text-sm text-muted-foreground">Exibir animação ao completar todos os passos</p>
          </div>
          <Switch
            checked={config.show_celebration ?? true}
            onCheckedChange={(checked) => onUpdate({ show_celebration: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StepperStepEditor: React.FC<{
  step: OnboardingStep | null;
  onSave: (stepData: Partial<OnboardingStep>) => void;
  onClose: () => void;
}> = ({ step, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<OnboardingStep>>({
    key: step?.key || '',
    title: step?.title || '',
    description: step?.description || '',
    icon: step?.icon || '',
    action_path: step?.action_path || '',
    action_hint: step?.action_hint || '',
    completion_event: step?.completion_event || '',
    target_count: step?.target_count || 1,
    active: step?.active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {step ? 'Editar Passo' : 'Novo Passo'}
          </h3>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="step_key">Chave do Passo</Label>
              <Input
                id="step_key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="icon">Ícone</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="CheckCircle"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="action_path">Caminho da Ação</Label>
              <Input
                id="action_path"
                value={formData.action_path}
                onChange={(e) => setFormData(prev => ({ ...prev, action_path: e.target.value }))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="completion_event">Evento de Conclusão</Label>
              <Input
                id="completion_event"
                value={formData.completion_event}
                onChange={(e) => setFormData(prev => ({ ...prev, completion_event: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="action_hint">Dica da Ação</Label>
              <Input
                id="action_hint"
                value={formData.action_hint}
                onChange={(e) => setFormData(prev => ({ ...prev, action_hint: e.target.value }))}
                placeholder="Opcional"
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target_count">Meta</Label>
              <Input
                id="target_count"
                type="number"
                value={formData.target_count}
                onChange={(e) => setFormData(prev => ({ ...prev, target_count: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label>Ativo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};