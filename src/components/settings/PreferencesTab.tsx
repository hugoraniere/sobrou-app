
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Trash2, MessageCircle } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';
import { useWhatsAppButton } from '@/contexts/WhatsAppButtonContext';
import ChangePasswordSection from '@/components/profile/ChangePasswordSection';
import ResetAccountDataDialog from '@/components/settings/ResetAccountDataDialog';
import { SETTINGS_TEXT } from '@/constants/text/settings';

const PreferencesTab = () => {
  const { t } = useTranslation();
  const { isEnabled, toggleAIChat } = useAIChat();
  const { isWhatsAppButtonEnabled, toggleWhatsAppButton } = useWhatsAppButton();
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.chatPreferences', SETTINGS_TEXT.chatPreferences)}
          </CardTitle>
          <CardDescription>
            {t('settings.chatPreferencesDesc', SETTINGS_TEXT.chatPreferencesDesc)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.enableAI', SETTINGS_TEXT.enableAI)}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.enableAIDesc', SETTINGS_TEXT.enableAIDesc)}
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={toggleAIChat} />
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label>{t('settings.showWhatsAppButton', 'Exibir Botão do WhatsApp')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.showWhatsAppButtonDesc', 'Exibe o botão flutuante do WhatsApp na aplicação')}
              </p>
            </div>
            <Switch checked={isWhatsAppButtonEnabled} onCheckedChange={toggleWhatsAppButton} />
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <ChangePasswordSection />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications', 'Notificações')}
          </CardTitle>
          <CardDescription>
            {t('settings.notificationsDesc', 'Gerencie suas preferências de notificação')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.pushNotifications', 'Notificações push')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.pushNotificationsDesc', 'Receba notificações importantes')}
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      {/* Danger Zone - Reset Account Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            {t('settings.dangerZone', 'Zona de Perigo')}
          </CardTitle>
          <CardDescription>
            {t('settings.dangerZoneDesc', 'Ações que podem causar perda de dados')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.resetAccountData', 'Resetar Dados da Conta')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.resetAccountDataDesc', 'Exclui todas as suas transações')}
              </p>
            </div>
            <Button 
              variant="destructive"
              onClick={() => setIsResetDialogOpen(true)}
            >
              {t('settings.resetData', 'Resetar Dados')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ResetAccountDataDialog 
        open={isResetDialogOpen} 
        onOpenChange={setIsResetDialogOpen} 
      />
    </div>
  );
};

export default PreferencesTab;
