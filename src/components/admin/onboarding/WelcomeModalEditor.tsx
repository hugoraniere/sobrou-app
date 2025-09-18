import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { Save, Upload } from 'lucide-react';

export const WelcomeModalEditor: React.FC = () => {
  const [config, setConfig] = useState({
    title: '',
    subtitle: '',
    image: '',
    cta_start: '',
    cta_close: '',
    show_admin_button: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const welcomeConfig = await OnboardingConfigService.getWelcomeModalConfig();
      setConfig(welcomeConfig);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await OnboardingConfigService.updateConfig('welcome_modal', {
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modal de Boas-vindas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Bem-vindo ao Sobrou 👋"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Textarea
            id="subtitle"
            value={config.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            placeholder="Este onboarding pode ser configurado no Admin..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="image">URL da Imagem (opcional)</Label>
          <div className="flex gap-2">
            <Input
              id="image"
              value={config.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://exemplo.com/imagem.png"
            />
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cta_start">Texto do Botão "Começar"</Label>
            <Input
              id="cta_start"
              value={config.cta_start}
              onChange={(e) => handleInputChange('cta_start', e.target.value)}
              placeholder="Começar"
            />
          </div>

          <div>
            <Label htmlFor="cta_close">Texto do Botão "Fechar"</Label>
            <Input
              id="cta_close"
              value={config.cta_close}
              onChange={(e) => handleInputChange('cta_close', e.target.value)}
              placeholder="Fechar"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show_admin_button"
            checked={config.show_admin_button}
            onCheckedChange={(checked) => handleInputChange('show_admin_button', checked)}
          />
          <Label htmlFor="show_admin_button">Mostrar botão de configuração do Admin</Label>
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