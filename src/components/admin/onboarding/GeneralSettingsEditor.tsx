import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { OnboardingService } from '@/services/OnboardingService';
import { Save, RotateCcw, AlertTriangle } from 'lucide-react';

export const GeneralSettingsEditor: React.FC = () => {
  const [config, setConfig] = useState({
    auto_show_welcome: true,
    auto_complete_steps: true,
    show_completion_celebration: true,
    reset_on_new_users: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const generalSettings = await OnboardingConfigService.getGeneralSettings();
      setConfig(generalSettings);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await OnboardingConfigService.updateConfig('general_settings', {
        content: config
      });
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleResetAllProgress = async () => {
    if (!confirm('Tem certeza que deseja resetar o progresso de TODOS os usuários? Esta ação não pode ser desfeita.')) {
      return;
    }

    setResetting(true);
    try {
      const success = await OnboardingService.resetProgress();
      if (success) {
        toast.success('Progresso de todos os usuários resetado com sucesso');
      } else {
        toast.error('Erro ao resetar progresso');
      }
    } catch (error) {
      toast.error('Erro ao resetar progresso');
    } finally {
      setResetting(false);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              id="auto_show_welcome"
              checked={config.auto_show_welcome}
              onCheckedChange={(checked) => handleInputChange('auto_show_welcome', checked)}
            />
            <Label htmlFor="auto_show_welcome">Mostrar modal de boas-vindas automaticamente para novos usuários</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="auto_complete_steps"
              checked={config.auto_complete_steps}
              onCheckedChange={(checked) => handleInputChange('auto_complete_steps', checked)}
            />
            <Label htmlFor="auto_complete_steps">Completar passos automaticamente baseado em eventos</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="show_completion_celebration"
              checked={config.show_completion_celebration}
              onCheckedChange={(checked) => handleInputChange('show_completion_celebration', checked)}
            />
            <Label htmlFor="show_completion_celebration">Mostrar celebração quando onboarding for concluído</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="reset_on_new_users"
              checked={config.reset_on_new_users}
              onCheckedChange={(checked) => handleInputChange('reset_on_new_users', checked)}
            />
            <Label htmlFor="reset_on_new_users">Resetar configurações para novos usuários automaticamente</Label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Ações de Administração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-900 mb-2">Resetar Progresso de Todos os Usuários</h4>
            <p className="text-sm text-red-700 mb-3">
              Esta ação irá remover o progresso de onboarding de todos os usuários. 
              Eles verão o modal de boas-vindas novamente na próxima vez que fizerem login.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleResetAllProgress} 
              disabled={resetting}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {resetting ? 'Resetando...' : 'Resetar Progresso de Todos'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};