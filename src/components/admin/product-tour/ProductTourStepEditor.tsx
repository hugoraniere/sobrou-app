import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical,
  MapPin,
  Eye,
  Save
} from 'lucide-react';
import { ProductTourStep } from '@/types/product-tour';
import { getTourAnchors, getAllRouteKeys } from '@/utils/tour-anchors';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

interface ProductTourStepEditorProps {
  tour: {
    id: string;
    name: string;
    steps: ProductTourStep[];
  };
  onSave: (steps: ProductTourStep[]) => void;
  onCancel: () => void;
}

const ProductTourStepEditor: React.FC<ProductTourStepEditorProps> = ({
  tour,
  onSave,
  onCancel
}) => {
  const [steps, setSteps] = useState<ProductTourStep[]>(tour.steps || []);
  const [selectedStep, setSelectedStep] = useState<ProductTourStep | null>(null);
  const [availableRoutes] = useState(getAllRouteKeys());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // If no steps exist, create a default set
    if (steps.length === 0) {
      const defaultSteps: Partial<ProductTourStep>[] = [
        {
          step_key: 'welcome',
          title: 'Bem-vindo ao Sobrou!',
          description: 'Vamos fazer um tour rápido pelas principais funcionalidades',
          page_route: '/',
          anchor_id: 'main-navigation',
          step_order: 1,
          is_active: true
        },
        {
          step_key: 'transactions',
          title: 'Suas Transações',
          description: 'Aqui você pode visualizar e gerenciar todas as suas transações financeiras',
          page_route: '/transactions',
          anchor_id: 'transactions-table',
          step_order: 2,
          is_active: true
        },
        {
          step_key: 'monthly-summary',
          title: 'Resumo Mensal',
          description: 'Acompanhe seus gastos e receitas mensais de forma visual',
          page_route: '/monthly-summary',
          anchor_id: 'monthly-chart',
          step_order: 3,
          is_active: true
        }
      ];

      const newSteps = defaultSteps.map((step, index) => ({
        id: `step-${index + 1}`,
        step_key: step.step_key!,
        title: step.title!,
        description: step.description!,
        page_route: step.page_route!,
        anchor_id: step.anchor_id!,
        step_order: step.step_order!,
        is_active: step.is_active!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as ProductTourStep[];

      setSteps(newSteps);
    }
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          step_order: index + 1
        }));
      });
    }
  };

  const handleAddStep = () => {
    const newStep: ProductTourStep = {
      id: `step-${Date.now()}`,
      step_key: `step_${steps.length + 1}`,
      title: 'Novo Passo',
      description: 'Descrição do novo passo',
      page_route: '/',
      anchor_id: '',
      step_order: steps.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSteps([...steps, newStep]);
    setSelectedStep(newStep);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
  };

  const handleUpdateStep = (updatedStep: ProductTourStep) => {
    setSteps(steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
    setSelectedStep(updatedStep);
  };

  const getAvailableAnchors = (pageRoute: string) => {
    return getTourAnchors(pageRoute);
  };

  const handleSave = () => {
    onSave(steps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Editar Tour: {tour.name}
            </h2>
            <p className="text-text-secondary">
              Configure os passos do product tour
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Tour
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Passos do Tour ({steps.length})
              </CardTitle>
              <Button size="sm" onClick={handleAddStep} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <SortableItem key={step.id} id={step.id}>
                      <div
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStep?.id === step.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-surface-secondary hover:bg-surface-secondary/80'
                        }`}
                        onClick={() => setSelectedStep(step)}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-text-secondary cursor-grab" />
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-text-primary truncate">
                              {step.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {step.page_route}
                              </Badge>
                              <Badge variant={step.is_active ? "default" : "secondary"} className="text-xs">
                                {step.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStep(step.id);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {steps.length === 0 && (
              <div className="text-center py-8 text-text-secondary">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum passo criado</p>
                <Button size="sm" onClick={handleAddStep} className="mt-2">
                  Criar Primeiro Passo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedStep ? 'Editar Passo' : 'Selecione um Passo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStep ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="step-title">Título</Label>
                  <Input
                    id="step-title"
                    value={selectedStep.title}
                    onChange={(e) => handleUpdateStep({
                      ...selectedStep,
                      title: e.target.value
                    })}
                    placeholder="Ex: Bem-vindo às transações"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step-description">Descrição</Label>
                  <Textarea
                    id="step-description"
                    value={selectedStep.description}
                    onChange={(e) => handleUpdateStep({
                      ...selectedStep,
                      description: e.target.value
                    })}
                    placeholder="Explique o que o usuário pode fazer nesta seção"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step-route">Página</Label>
                  <Select
                    value={selectedStep.page_route}
                    onValueChange={(value) => handleUpdateStep({
                      ...selectedStep,
                      page_route: value,
                      anchor_id: '' // Reset anchor when route changes
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma página" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoutes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step-anchor">Elemento a Destacar</Label>
                  <Select
                    value={selectedStep.anchor_id}
                    onValueChange={(value) => handleUpdateStep({
                      ...selectedStep,
                      anchor_id: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um elemento" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableAnchors(selectedStep.page_route).map((anchor) => (
                        <SelectItem key={anchor.id} value={anchor.id}>
                          {anchor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step-key">Chave do Passo</Label>
                  <Input
                    id="step-key"
                    value={selectedStep.step_key}
                    onChange={(e) => handleUpdateStep({
                      ...selectedStep,
                      step_key: e.target.value
                    })}
                    placeholder="Ex: welcome_step"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="step-active">Passo Ativo</Label>
                  <Switch
                    id="step-active"
                    checked={selectedStep.is_active}
                    onCheckedChange={(checked) => handleUpdateStep({
                      ...selectedStep,
                      is_active: checked
                    })}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-text-primary mb-2">Preview do Passo</h4>
                  <div className="p-3 bg-surface-secondary rounded-lg">
                    <h5 className="font-semibold text-text-primary">
                      {selectedStep.title}
                    </h5>
                    <p className="text-sm text-text-secondary mt-1">
                      {selectedStep.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedStep.page_route}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        #{selectedStep.anchor_id || 'sem-elemento'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Selecione um passo da lista para editar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductTourStepEditor;