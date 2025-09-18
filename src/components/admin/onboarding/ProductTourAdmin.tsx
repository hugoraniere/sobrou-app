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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Settings, 
  Palette, 
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  Play,
  RefreshCw
} from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';
import { ProductTourAdminService, ProductTourAdminConfig } from '@/services/ProductTourAdminService';
import { ProductTourStep } from '@/types/product-tour';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useOnboardingAdmin, useVirtualization } from '@/hooks/useOnboardingAdmin';
import { StepValidation } from './StepValidation';
import { BehaviorSettings } from './BehaviorSettings';
import { ComponentSelector } from './ComponentSelector';
import { AnchorPickerDrawer } from './AnchorPickerDrawer';

export const ProductTourAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuracoes');
  const [config, setConfig] = useState<ProductTourAdminConfig | null>(null);
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<ProductTourStep | null>(null);
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; step: ProductTourStep | null }>({
    isOpen: false,
    step: null
  });
  
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

  const handleStepDelete = (step: ProductTourStep) => {
    setDeleteConfirmation({ isOpen: true, step });
  };

  const confirmStepDelete = async () => {
    if (!deleteConfirmation.step) return;
    
    const success = await ProductTourAdminService.deleteStep(deleteConfirmation.step.id);
    if (success) {
      setSteps(prev => prev.filter(s => s.id !== deleteConfirmation.step!.id));
      toast.success('Passo removido com sucesso');
    } else {
      toast.error('Erro ao remover passo');
    }
    
    setDeleteConfirmation({ isOpen: false, step: null });
  };

  const handleToggleStep = async (stepId: string, isActive: boolean) => {
    const success = await ProductTourAdminService.updateStep(stepId, { is_active: isActive });
    if (success) {
      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, is_active: isActive } : s));
      toast.success(`Passo ${isActive ? 'ativado' : 'desativado'}`);
    } else {
      toast.error('Erro ao atualizar passo');
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
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config?.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <h2 className="font-semibold">Product Tour</h2>
            <p className="text-sm text-muted-foreground">
              {config?.enabled ? 'Ativo' : 'Inativo'} • Versão {config?.version || '1.0'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configurações</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
          <TabsTrigger value="steps" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Passos
          </TabsTrigger>
          <TabsTrigger value="personalizacao" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Personalização</span>
            <span className="sm:hidden">Visual</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracoes" className="space-y-4">
          <ConfiguracoesSection config={config} onUpdate={handleConfigUpdate} />
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <StepsManager 
            steps={steps}
            groupedSteps={groupedSteps}
            onEdit={setEditingStep}
            onDelete={handleStepDelete}
            onToggle={handleToggleStep}
            onDragEnd={handleDragEnd}
            onCreateNew={() => setIsCreatingStep(true)}
          />
        </TabsContent>

        <TabsContent value="personalizacao" className="space-y-4">
          <PersonalizacaoSection config={config} onUpdate={handleConfigUpdate} />
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, step: null })}
        onConfirm={confirmStepDelete}
        title="Confirmar Exclusão"
        description={
          deleteConfirmation.step 
            ? `Tem certeza que deseja excluir o passo "${deleteConfirmation.step.title}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

const ConfiguracoesSection: React.FC<{
  config: ProductTourAdminConfig | null;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Accordion type="single" collapsible defaultValue="geral" className="w-full">
      <AccordionItem value="geral">
        <AccordionTrigger>Configurações Gerais</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Ativar Product Tour</Label>
                    <p className="text-sm text-muted-foreground">Habilitar o tour guiado</p>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => onUpdate({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Iniciar automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Para novos usuários</p>
                  </div>
                  <Switch
                    checked={config.auto_start_for_new_users}
                    onCheckedChange={(checked) => onUpdate({ auto_start_for_new_users: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mostrar progresso</Label>
                    <p className="text-sm text-muted-foreground">Barra de progresso</p>
                  </div>
                  <Switch
                    checked={config.show_progress}
                    onCheckedChange={(checked) => onUpdate({ show_progress: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Permitir pular</Label>
                    <p className="text-sm text-muted-foreground">Usuários podem pular</p>
                  </div>
                  <Switch
                    checked={config.allow_skip}
                    onCheckedChange={(checked) => onUpdate({ allow_skip: checked })}
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="version">Versão do Tour</Label>
                <Input
                  id="version"
                  value={config.version}
                  onChange={(e) => onUpdate({ version: e.target.value })}
                  placeholder="1.0"
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="visibilidade">
        <AccordionTrigger>Regras de Visibilidade</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
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

                <div className="space-y-2">
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
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const StepsManager: React.FC<{
  steps: ProductTourStep[];
  groupedSteps: Record<string, ProductTourStep[]>;
  onEdit: (step: ProductTourStep) => void;
  onDelete: (step: ProductTourStep) => void;
  onToggle: (stepId: string, isActive: boolean) => void;
  onDragEnd: (result: any) => void;
  onCreateNew: () => void;
}> = ({ steps, groupedSteps, onEdit, onDelete, onToggle, onDragEnd, onCreateNew }) => {
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
                              
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={step.is_active}
                                  onCheckedChange={(checked) => onToggle(step.id, checked)}
                                />
                                <Badge variant={step.is_active ? "default" : "secondary"}>
                                  {step.is_active ? "Ativo" : "Inativo"}
                                </Badge>
                              </div>
                              
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
                                onClick={() => onDelete(step)}
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

const PersonalizacaoSection: React.FC<{
  config: ProductTourAdminConfig | null;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <Accordion type="single" collapsible defaultValue="aparencia" className="w-full">
      <AccordionItem value="aparencia">
        <AccordionTrigger>Aparência Visual</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex gap-2">
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
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.colors.primary}
                      onChange={(e) => 
                        onUpdate({ 
                          colors: { 
                            ...config.colors, 
                            primary: e.target.value 
                          } 
                        })
                      }
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background-color">Cor de Fundo</Label>
                  <div className="flex gap-2">
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
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.colors.background}
                      onChange={(e) => 
                        onUpdate({ 
                          colors: { 
                            ...config.colors, 
                            background: e.target.value 
                          } 
                        })
                      }
                      className="flex-1"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Cor do Texto</Label>
                  <div className="flex gap-2">
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
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.colors.text}
                      onChange={(e) => 
                        onUpdate({ 
                          colors: { 
                            ...config.colors, 
                            text: e.target.value 
                          } 
                        })
                      }
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overlay-color">Cor do Overlay</Label>
                  <div className="flex gap-2">
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
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.colors.overlay}
                      onChange={(e) => 
                        onUpdate({ 
                          colors: { 
                            ...config.colors, 
                            overlay: e.target.value 
                          } 
                        })
                      }
                      className="flex-1"
                      placeholder="rgba(0,0,0,0.5)"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="comportamento">
        <AccordionTrigger>Comportamento</AccordionTrigger>
        <AccordionContent>
          <BehaviorSettings config={config} onUpdate={onUpdate} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
    is_active: step?.is_active ?? true
  });
  const [isAnchorPickerOpen, setIsAnchorPickerOpen] = useState(false);

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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="anchor_id">Componente de Âncora</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAnchorPickerOpen(true)}
              >
                {formData.anchor_id ? 'Alterar Componente' : 'Selecionar Componente'}
              </Button>
            </div>
            
            {formData.anchor_id && (
              <Input
                id="anchor_id"
                value={formData.anchor_id}
                onChange={(e) => setFormData(prev => ({ ...prev, anchor_id: e.target.value }))}
                placeholder="ID do componente âncora"
              />
            )}

            <AnchorPickerDrawer
              open={isAnchorPickerOpen}
              onOpenChange={setIsAnchorPickerOpen}
              value={formData.anchor_id || ''}
              onChange={(anchorId) => setFormData(prev => ({ ...prev, anchor_id: anchorId }))}
              defaultRoute={formData.page_route || ''}
            />
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