import React, { useState, useEffect } from 'react';
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
  Play,
  Pause,
  Upload,
  Image as ImageIcon,
  Video,
  FileImage
} from 'lucide-react';
import { toast } from 'sonner';
import { ModalInformativoService, ModalInformativoConfig, ModalInformativoSlide } from '@/services/ModalInformativoService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const ModalInformativoAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configs');
  const [configs, setConfigs] = useState<ModalInformativoConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ModalInformativoConfig | null>(null);
  const [slides, setSlides] = useState<ModalInformativoSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<ModalInformativoSlide | null>(null);
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [isCreatingConfig, setIsCreatingConfig] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      loadSlides(selectedConfig.id);
    }
  }, [selectedConfig]);

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const configsData = await ModalInformativoService.getConfigs();
      setConfigs(configsData);
      if (configsData.length > 0 && !selectedConfig) {
        setSelectedConfig(configsData[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações do modal');
    }
    setIsLoading(false);
  };

  const loadSlides = async (modalId: string) => {
    try {
      const slidesData = await ModalInformativoService.getSlides(modalId);
      setSlides(slidesData);
    } catch (error) {
      toast.error('Erro ao carregar slides');
    }
  };

  const handleConfigSave = async (configData: Partial<ModalInformativoConfig>) => {
    let success = false;
    
    if (selectedConfig) {
      const updated = await ModalInformativoService.updateConfig(selectedConfig.id, configData);
      success = !!updated;
      if (updated) {
        setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updated : c));
        setSelectedConfig(updated);
      }
    } else {
      const created = await ModalInformativoService.createConfig(configData);
      success = !!created;
      if (created) {
        setConfigs(prev => [...prev, created]);
        setSelectedConfig(created);
        setIsCreatingConfig(false);
      }
    }

    if (success) {
      toast.success('Modal configurado com sucesso');
    } else {
      toast.error('Erro ao salvar configuração');
    }
  };

  const handleConfigDelete = async (configId: string) => {
    const success = await ModalInformativoService.deleteConfig(configId);
    if (success) {
      setConfigs(prev => prev.filter(c => c.id !== configId));
      if (selectedConfig?.id === configId) {
        setSelectedConfig(configs.length > 1 ? configs[0] : null);
      }
      toast.success('Modal removido');
    } else {
      toast.error('Erro ao remover modal');
    }
  };

  const handleSlideSave = async (slideData: Partial<ModalInformativoSlide>) => {
    if (!selectedConfig) return;

    let success = false;
    
    if (editingSlide) {
      const updated = await ModalInformativoService.updateSlide(editingSlide.id, slideData);
      success = !!updated;
      if (updated) {
        setSlides(prev => prev.map(s => s.id === editingSlide.id ? updated : s));
      }
    } else {
      const created = await ModalInformativoService.createSlide({
        ...slideData,
        modal_id: selectedConfig.id,
        slide_order: slides.length,
        is_active: true
      });
      success = !!created;
      if (created) {
        setSlides(prev => [...prev, created]);
      }
    }

    if (success) {
      toast.success(editingSlide ? 'Slide atualizado' : 'Slide criado');
      setEditingSlide(null);
      setIsCreatingSlide(false);
    } else {
      toast.error('Erro ao salvar slide');
    }
  };

  const handleSlideDelete = async (slideId: string) => {
    const success = await ModalInformativoService.deleteSlide(slideId);
    if (success) {
      setSlides(prev => prev.filter(s => s.id !== slideId));
      toast.success('Slide removido');
    } else {
      toast.error('Erro ao remover slide');
    }
  };

  const handleSlideDragEnd = async (result: any) => {
    if (!result.destination || !selectedConfig) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSlides(items);
    await ModalInformativoService.reorderSlides(selectedConfig.id, items.map(s => s.id));
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configs" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="slides" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Slides
          </TabsTrigger>
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Visibilidade
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configs" className="space-y-4">
          <ModalConfigsManager 
            configs={configs}
            selectedConfig={selectedConfig}
            onSelect={setSelectedConfig}
            onCreate={() => setIsCreatingConfig(true)}
            onUpdate={handleConfigSave}
            onDelete={handleConfigDelete}
          />
        </TabsContent>

        <TabsContent value="slides" className="space-y-4">
          <ModalSlidesManager 
            slides={slides}
            selectedConfig={selectedConfig}
            onEdit={setEditingSlide}
            onDelete={handleSlideDelete}
            onDragEnd={handleSlideDragEnd}
            onCreateNew={() => setIsCreatingSlide(true)}
          />
        </TabsContent>

        <TabsContent value="visibility" className="space-y-4">
          <ModalVisibilitySettings 
            config={selectedConfig}
            onUpdate={(updates) => selectedConfig && handleConfigSave(updates)}
          />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <ModalAppearanceSettings 
            config={selectedConfig}
            onUpdate={(updates) => selectedConfig && handleConfigSave(updates)}
          />
        </TabsContent>
      </Tabs>

      {/* Slide Editor Modal */}
      {(editingSlide || isCreatingSlide) && (
        <SlideEditor
          slide={editingSlide}
          onSave={handleSlideSave}
          onClose={() => {
            setEditingSlide(null);
            setIsCreatingSlide(false);
          }}
        />
      )}

      {/* Config Creator Modal */}
      {isCreatingConfig && (
        <ConfigCreator
          onSave={handleConfigSave}
          onClose={() => setIsCreatingConfig(false)}
        />
      )}
    </div>
  );
};

const ModalConfigsManager: React.FC<{
  configs: ModalInformativoConfig[];
  selectedConfig: ModalInformativoConfig | null;
  onSelect: (config: ModalInformativoConfig) => void;
  onCreate: () => void;
  onUpdate: (updates: Partial<ModalInformativoConfig>) => void;
  onDelete: (configId: string) => void;
}> = ({ configs, selectedConfig, onSelect, onCreate, onUpdate, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Modais Informativos</CardTitle>
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Modal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {configs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum modal criado ainda. Crie seu primeiro modal informativo.
          </p>
        ) : (
          <div className="space-y-2">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedConfig?.id === config.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelect(config)}
              >
                <div className="flex-1">
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {config.auto_transition ? 'Transição automática' : 'Transição manual'}
                  </div>
                </div>
                
                <Badge variant={config.is_active ? "default" : "secondary"}>
                  {config.is_active ? "Ativo" : "Inativo"}
                </Badge>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ is_active: !config.is_active });
                  }}
                >
                  {config.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(config.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {selectedConfig && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <h4 className="font-medium">Configurações Gerais</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="modal-name">Nome do Modal</Label>
                <Input
                  id="modal-name"
                  value={selectedConfig.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="transition-time">Tempo de Transição (ms)</Label>
                <Input
                  id="transition-time"
                  type="number"
                  value={selectedConfig.transition_time}
                  onChange={(e) => onUpdate({ transition_time: parseInt(e.target.value) || 5000 })}
                  disabled={!selectedConfig.auto_transition}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Transição Automática</Label>
                <p className="text-sm text-muted-foreground">Avançar slides automaticamente</p>
              </div>
              <Switch
                checked={selectedConfig.auto_transition}
                onCheckedChange={(checked) => onUpdate({ auto_transition: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Mostrar Indicadores</Label>
                <p className="text-sm text-muted-foreground">Pontos indicadores na parte inferior</p>
              </div>
              <Switch
                checked={selectedConfig.show_indicators}
                onCheckedChange={(checked) => onUpdate({ show_indicators: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Mostrar Navegação</Label>
                <p className="text-sm text-muted-foreground">Botões anterior/próximo</p>
              </div>
              <Switch
                checked={selectedConfig.show_navigation}
                onCheckedChange={(checked) => onUpdate({ show_navigation: checked })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ModalSlidesManager: React.FC<{
  slides: ModalInformativoSlide[];
  selectedConfig: ModalInformativoConfig | null;
  onEdit: (slide: ModalInformativoSlide) => void;
  onDelete: (slideId: string) => void;
  onDragEnd: (result: any) => void;
  onCreateNew: () => void;
}> = ({ slides, selectedConfig, onEdit, onDelete, onDragEnd, onCreateNew }) => {
  if (!selectedConfig) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Selecione um modal para gerenciar seus slides</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Slides do Modal: {selectedConfig.name}</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Slide
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {slides.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum slide criado ainda. Adicione o primeiro slide ao modal.
          </p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modal-slides">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-2 p-3 border rounded-lg bg-card"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          
                          {slide.media_url && (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                              {slide.media_type === 'video' ? (
                                <Video className="w-6 h-6 text-muted-foreground" />
                              ) : (
                                <FileImage className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="font-medium">{slide.title}</div>
                            {slide.subtitle && (
                              <div className="text-sm text-muted-foreground">{slide.subtitle}</div>
                            )}
                            {slide.cta_text && (
                              <div className="text-xs text-primary">CTA: {slide.cta_text}</div>
                            )}
                          </div>
                          
                          <Badge variant={slide.is_active ? "default" : "secondary"}>
                            {slide.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(slide)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(slide.id)}
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
        )}
      </CardContent>
    </Card>
  );
};

const ModalVisibilitySettings: React.FC<{
  config: ModalInformativoConfig | null;
  onUpdate: (updates: Partial<ModalInformativoConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Selecione um modal para configurar a visibilidade</p>
        </CardContent>
      </Card>
    );
  }

  const visibilityRules = config.visibility_rules || { show_on: 'first_access', target_users: 'all' };

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
            onValueChange={(value: any) => 
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
              <SelectItem value="always">Sempre mostrar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label>Usuários alvo</Label>
          <Select
            value={visibilityRules.target_users}
            onValueChange={(value: any) => 
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
      </CardContent>
    </Card>
  );
};

const ModalAppearanceSettings: React.FC<{
  config: ModalInformativoConfig | null;
  onUpdate: (updates: Partial<ModalInformativoConfig>) => void;
}> = ({ config, onUpdate }) => {
  if (!config) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Selecione um modal para configurar a aparência</p>
        </CardContent>
      </Card>
    );
  }

  const colors = config.colors || { primary: '#10b981', background: '#ffffff', text: '#374151' };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização Visual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="modal-primary-color">Cor Primária</Label>
            <Input
              id="modal-primary-color"
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
            <Label htmlFor="modal-background-color">Cor de Fundo</Label>
            <Input
              id="modal-background-color"
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
            <Label htmlFor="modal-text-color">Cor do Texto</Label>
            <Input
              id="modal-text-color"
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

const SlideEditor: React.FC<{
  slide: ModalInformativoSlide | null;
  onSave: (slideData: Partial<ModalInformativoSlide>) => void;
  onClose: () => void;
}> = ({ slide, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ModalInformativoSlide>>({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    cta_text: slide?.cta_text || '',
    cta_url: slide?.cta_url || '',
    media_url: slide?.media_url || '',
    media_type: slide?.media_type || 'image',
    is_active: slide?.is_active ?? true
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
            {slide ? 'Editar Slide' : 'Novo Slide'}
          </h3>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="slide-title">Título</Label>
            <Input
              id="slide-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="slide-subtitle">Subtítulo</Label>
            <Input
              id="slide-subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="slide-description">Descrição</Label>
            <Textarea
              id="slide-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cta-text">Texto do CTA</Label>
              <Input
                id="cta-text"
                value={formData.cta_text}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                placeholder="Opcional"
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cta-url">URL do CTA</Label>
              <Input
                id="cta-url"
                value={formData.cta_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="media-type">Tipo de Mídia</Label>
              <Select
                value={formData.media_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, media_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="media-url">URL da Mídia</Label>
              <Input
                id="media-url"
                value={formData.media_url}
                onChange={(e) => setFormData(prev => ({ ...prev, media_url: e.target.value }))}
                placeholder="https://..."
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

const ConfigCreator: React.FC<{
  onSave: (configData: Partial<ModalInformativoConfig>) => void;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    auto_transition: false,
    transition_time: 5000,
    show_indicators: true,
    show_navigation: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Novo Modal Informativo</h3>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="config-name">Nome do Modal</Label>
            <Input
              id="config-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Modal de Boas-vindas"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Transição Automática</Label>
              <p className="text-sm text-muted-foreground">Avançar slides automaticamente</p>
            </div>
            <Switch
              checked={formData.auto_transition}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_transition: checked }))}
            />
          </div>

          {formData.auto_transition && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="transition-time">Tempo entre slides (ms)</Label>
              <Input
                id="transition-time"
                type="number"
                value={formData.transition_time}
                onChange={(e) => setFormData(prev => ({ ...prev, transition_time: parseInt(e.target.value) || 5000 }))}
                min="1000"
                step="500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Modal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};