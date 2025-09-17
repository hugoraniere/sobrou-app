import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductTourAdminService, ProductTourAdminConfig } from '@/services/ProductTourAdminService';
import { ProductTourStep } from '@/types/product-tour';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useOnboardingAdmin, useVirtualization } from '@/hooks/useOnboardingAdmin';
import { StepValidation } from './StepValidation';
import { BehaviorSettings } from './BehaviorSettings';

export const ProductTourAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [config, setConfig] = useState<ProductTourAdminConfig | null>(null);
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<ProductTourStep | null>(null);
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  
  const { debouncedSave } = useOnboardingAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [configData, stepsData] = await Promise.all([
        ProductTourAdminService.getConfig(),
        ProductTourAdminService.getSteps()
      ]);
      setConfig(configData);
      setSteps(stepsData);
    } catch (error) {
      toast.error('Erro ao carregar dados do Product Tour');
    }
    setIsLoading(false);
  };

  const handleConfigUpdate = useCallback(async (updates: Partial<ProductTourAdminConfig>) => {
    if (!config) return;
    
    // Optimistic update for better UX
    const updatedConfig = { ...config, ...updates };
    setConfig(updatedConfig);
    
    // Debounced save to prevent excessive API calls
    debouncedSave(async () => {
      const success = await ProductTourAdminService.updateConfig(updatedConfig);
      if (!success) {
        // Revert on failure
        setConfig(config);
        throw new Error('Falha ao atualizar configuração');
      }
    });
  }, [config, debouncedSave]);

  const handleStepSave = async (stepData: Partial<ProductTourStep>) => {
    let success = false;
    
    if (editingStep) {
      const updated = await ProductTourAdminService.updateStep(editingStep.id, stepData);
      success = !!updated;
      if (updated) {
        setSteps(prev => prev.map(s => s.id === editingStep.id ? updated : s));
      }
    } else {
      const created = await ProductTourAdminService.createStep({
        ...stepData,
        step_order: steps.length,
        is_active: true
      });
      success = !!created;
      if (created) {
        setSteps(prev => [...prev, created]);
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

  const handleStepDelete = async (stepId: string) => {
    const success = await ProductTourAdminService.deleteStep(stepId);
    if (success) {
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
    await ProductTourAdminService.reorderSteps(items.map(s => s.id));
  };

  // Memoize expensive calculations for performance
  const groupedSteps = useMemo(() => 
    ProductTourAdminService.groupStepsByPage(steps), 
    [steps]
  );
  
  const sortedSteps = useMemo(() => 
    [...steps].sort((a, b) => a.step_order - b.step_order),
    [steps]
  );

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
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Visibilidade
          </TabsTrigger>
          <TabsTrigger value="steps" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Passos
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
          <GeneralSettings config={config} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="visibility" className="space-y-4">
          <VisibilitySettings config={config} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <StepsManager 
            steps={steps}
            groupedSteps={groupedSteps}
            onEdit={setEditingStep}
            onDelete={handleStepDelete}
            onDragEnd={handleDragEnd}
            onCreateNew={() => setIsCreatingStep(true)}
          />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings config={config} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <BehaviorSettings config={config} onUpdate={handleConfigUpdate} />
        </TabsContent>
      </Tabs>

      {/* Step Editor Modal */}
      {(editingStep || isCreatingStep) && (
        <StepEditor
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

const GeneralSettings: React.FC<{
  config: ProductTourAdminConfig | null;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Ativar Product Tour</Label>
            <p className="text-sm text-muted-foreground">Habilitar o tour guiado para os usuários</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Iniciar automaticamente para novos usuários</Label>
            <p className="text-sm text-muted-foreground">Mostrar tour automaticamente no primeiro acesso</p>
          </div>
          <Switch
            checked={config.auto_start_for_new_users}
            onCheckedChange={(checked) => onUpdate({ auto_start_for_new_users: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Mostrar progresso</Label>
            <p className="text-sm text-muted-foreground">Exibir barra de progresso durante o tour</p>
          </div>
          <Switch
            checked={config.show_progress}
            onCheckedChange={(checked) => onUpdate({ show_progress: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Permitir pular</Label>
            <p className="text-sm text-muted-foreground">Permitir que usuários pulem o tour</p>
          </div>
          <Switch
            checked={config.allow_skip}
            onCheckedChange={(checked) => onUpdate({ allow_skip: checked })}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="version">Versão do Tour</Label>
          <Input
            id="version"
            value={config.version}
            onChange={(e) => onUpdate({ version: e.target.value })}
            placeholder="1.0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const VisibilitySettings: React.FC<{
  config: ProductTourAdminConfig | null;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Visibilidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Quando mostrar</Label>
          <Select
            value={config.visibility_rules.show_on}
            onValueChange={(value: any) => 
              onUpdate({ 
                visibility_rules: { 
                  ...config.visibility_rules, 
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
            value={config.visibility_rules.target_users}
            onValueChange={(value: any) => 
              onUpdate({ 
                visibility_rules: { 
                  ...config.visibility_rules, 
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
      </CardContent>
    </Card>
  );
};

const StepsManager: React.FC<{
  steps: ProductTourStep[];
  groupedSteps: Record<string, ProductTourStep[]>;
  onEdit: (step: ProductTourStep) => void;
  onDelete: (stepId: string) => void;
  onDragEnd: (result: any) => void;
  onCreateNew: () => void;
}> = ({ steps, groupedSteps, onEdit, onDelete, onDragEnd, onCreateNew }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Passos do Tour</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Passo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedSteps).map(([page, pageSteps]) => (
            <div key={page} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Página: {page}</h4>
                <Badge variant="secondary">{pageSteps.length} passos</Badge>
              </div>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={page}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {pageSteps.map((step, index) => (
                        <Draggable key={step.id} draggableId={step.id} index={index}>
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
                                <StepValidation 
                                  anchorId={step.anchor_id}
                                  pageRoute={step.page_route}
                                  className="mt-1"
                                />
                              </div>
                              
                              <Badge variant={step.is_active ? "default" : "secondary"}>
                                {step.is_active ? "Ativo" : "Inativo"}
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AppearanceSettings: React.FC<{
  config: ProductTourAdminConfig | null;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização Visual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="primary-color">Cor Primária</Label>
            <Input
              id="primary-color"
              type="color"
              value={config.colors.primary}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...config.colors, 
                    primary: e.target.value 
                  } 
                })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="background-color">Cor de Fundo</Label>
            <Input
              id="background-color"
              type="color"
              value={config.colors.background}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...config.colors, 
                    background: e.target.value 
                  } 
                })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="text-color">Cor do Texto</Label>
            <Input
              id="text-color"
              type="color"
              value={config.colors.text}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...config.colors, 
                    text: e.target.value 
                  } 
                })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="overlay-color">Cor do Overlay</Label>
            <Input
              id="overlay-color"
              type="color"
              value={config.colors.overlay.replace('rgba(0, 0, 0, 0.5)', '#000000')}
              onChange={(e) => 
                onUpdate({ 
                  colors: { 
                    ...config.colors, 
                    overlay: `rgba(${parseInt(e.target.value.slice(1, 3), 16)}, ${parseInt(e.target.value.slice(3, 5), 16)}, ${parseInt(e.target.value.slice(5, 7), 16)}, 0.5)`
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

const StepEditor: React.FC<{
  step: ProductTourStep | null;
  onSave: (stepData: Partial<ProductTourStep>) => void;
  onClose: () => void;
}> = ({ step, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ProductTourStep>>({
    step_key: step?.step_key || '',
    title: step?.title || '',
    description: step?.description || '',
    anchor_id: step?.anchor_id || '',
    page_route: step?.page_route || '',
    visible_when: step?.visible_when || '',
    is_active: step?.is_active ?? true
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
                value={formData.step_key}
                onChange={(e) => setFormData(prev => ({ ...prev, step_key: e.target.value }))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="page_route">Rota da Página</Label>
              <Input
                id="page_route"
                value={formData.page_route}
                onChange={(e) => setFormData(prev => ({ ...prev, page_route: e.target.value }))}
                required
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
              <Label htmlFor="anchor_id">ID do Elemento</Label>
              <Input
                id="anchor_id"
                value={formData.anchor_id}
                onChange={(e) => setFormData(prev => ({ ...prev, anchor_id: e.target.value }))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="visible_when">Visível Quando</Label>
              <Input
                id="visible_when"
                value={formData.visible_when}
                onChange={(e) => setFormData(prev => ({ ...prev, visible_when: e.target.value }))}
                placeholder="Condição opcional"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
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