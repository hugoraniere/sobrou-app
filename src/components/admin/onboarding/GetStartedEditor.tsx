import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Eye, Settings, Plus, Trash2, GripVertical } from 'lucide-react';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { TasksManager } from './TasksManager';

interface GetStartedConfig {
  title: string;
  subtitle: string;
  is_enabled: boolean;
  show_progress_bar: boolean;
  show_minimize_button: boolean;
  completion_message: string;
}

export const GetStartedEditor: React.FC = () => {
  const [config, setConfig] = useState<GetStartedConfig>({
    title: 'Get Started',
    subtitle: 'Complete estas tarefas para aproveitar melhor o Sobrou',
    is_enabled: true,
    show_progress_bar: true,
    show_minimize_button: true,
    completion_message: 'Parabéns! Você concluiu todos os passos.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await OnboardingConfigService.getGetStartedConfig();
      if (data) {
        setConfig(data);
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await OnboardingConfigService.updateGetStartedConfig(config);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (field: keyof GetStartedConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Get Started
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure os textos e comportamento do componente Get Started
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ativação Global */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Ativar Get Started</h4>
              <p className="text-sm text-muted-foreground">
                Desative para ocultar completamente o componente Get Started do site
              </p>
            </div>
            <Switch
              checked={config.is_enabled}
              onCheckedChange={(checked) => handleConfigChange('is_enabled', checked)}
            />
          </div>

          <Separator />

          {/* Configurações de Texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  placeholder="Ex: Get Started"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea
                  id="subtitle"
                  value={config.subtitle}
                  onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                  placeholder="Ex: Complete estas tarefas para aproveitar melhor o Sobrou"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="completion_message">Mensagem de Conclusão</Label>
                <Input
                  id="completion_message"
                  value={config.completion_message}
                  onChange={(e) => handleConfigChange('completion_message', e.target.value)}
                  placeholder="Ex: Parabéns! Você concluiu todos os passos."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Opções de Interface</h4>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium text-sm">Barra de Progresso</div>
                  <div className="text-xs text-muted-foreground">Mostrar barra de progresso visual</div>
                </div>
                <Switch
                  checked={config.show_progress_bar}
                  onCheckedChange={(checked) => handleConfigChange('show_progress_bar', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium text-sm">Botão Minimizar</div>
                  <div className="text-xs text-muted-foreground">Permitir que usuários minimizem o componente</div>
                </div>
                <Switch
                  checked={config.show_minimize_button}
                  onCheckedChange={(checked) => handleConfigChange('show_minimize_button', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciador de Tarefas */}
      <TasksManager />

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{config.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {config.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">0/4 concluído</span>
                  {config.show_minimize_button && (
                    <button className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {config.show_progress_bar && (
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full w-1/4"></div>
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center py-8">
                Preview das tarefas aparecerá aqui...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};