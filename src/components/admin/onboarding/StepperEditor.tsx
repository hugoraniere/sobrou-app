import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { Save, Palette } from 'lucide-react';

export const StepperEditor: React.FC = () => {
  const [config, setConfig] = useState({
    title: '',
    show_progress: true,
    show_minimize: true,
    completion_message: '',
    colors: {
      primary: '#10b981',
      background: '#ffffff',
      text: '#374151'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const stepperConfig = await OnboardingConfigService.getStepperConfig();
      setConfig(stepperConfig);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await OnboardingConfigService.updateConfig('get_started_stepper', {
        content: config
      });
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (colorField: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorField]: value
      }
    }));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Stepper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="stepper_title">Título do Stepper</Label>
          <Input
            id="stepper_title"
            value={config.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Primeiros Passos"
          />
        </div>

        <div>
          <Label htmlFor="completion_message">Mensagem de Conclusão</Label>
          <Textarea
            id="completion_message"
            value={config.completion_message}
            onChange={(e) => handleInputChange('completion_message', e.target.value)}
            placeholder="Parabéns! Você concluiu todos os passos."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="show_progress"
              checked={config.show_progress}
              onCheckedChange={(checked) => handleInputChange('show_progress', checked)}
            />
            <Label htmlFor="show_progress">Mostrar barra de progresso</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="show_minimize"
              checked={config.show_minimize}
              onCheckedChange={(checked) => handleInputChange('show_minimize', checked)}
            />
            <Label htmlFor="show_minimize">Permitir minimizar stepper</Label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <Label>Personalização de Cores</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="color_primary">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="color_primary"
                  type="color"
                  value={config.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-16 h-10 p-1 rounded"
                />
                <Input
                  value={config.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#10b981"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="color_background">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="color_background"
                  type="color"
                  value={config.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-16 h-10 p-1 rounded"
                />
                <Input
                  value={config.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="color_text">Cor do Texto</Label>
              <div className="flex gap-2">
                <Input
                  id="color_text"
                  type="color"
                  value={config.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-16 h-10 p-1 rounded"
                />
                <Input
                  value={config.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  placeholder="#374151"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};