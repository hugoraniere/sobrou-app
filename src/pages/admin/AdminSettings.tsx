import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AdminSettingsService } from '@/services/adminSettingsService';
import { Settings, Save, Loader2 } from 'lucide-react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

interface AdminSettingsState {
  pwa_prompt_enabled: boolean;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsState>({
    pwa_prompt_enabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const pwaEnabled = await AdminSettingsService.getSetting('pwa_prompt_enabled');
      
      setSettings({
        pwa_prompt_enabled: pwaEnabled === true || pwaEnabled === 'true'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof AdminSettingsState, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      await AdminSettingsService.updateSetting('pwa_prompt_enabled', settings.pwa_prompt_enabled);
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout 
        title="Configurações do Sistema" 
        subtitle="Gerencie as configurações globais da aplicação"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Configurações do Sistema" 
      subtitle="Gerencie as configurações globais da aplicação"
    >
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades do Usuário</CardTitle>
          <CardDescription>
            Configure quais funcionalidades estão disponíveis para os usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="pwa-prompt">Prompt de Instalação PWA</Label>
              <p className="text-sm text-muted-foreground">
                Permite que o modal de instalação do app seja exibido para os usuários
              </p>
            </div>
            <Switch
              id="pwa-prompt"
              checked={settings.pwa_prompt_enabled}
              onCheckedChange={(checked) => handleSettingChange('pwa_prompt_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
      </div>
    </AdminPageLayout>
  );
};

export default AdminSettings;