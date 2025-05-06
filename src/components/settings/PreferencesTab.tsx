
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';
import ChangePasswordSection from '@/components/profile/ChangePasswordSection';

const PreferencesTab = () => {
  const { t } = useTranslation();
  const { isEnabled, toggleAIChat } = useAIChat();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.chatPreferences', 'Preferências de Chat')}
          </CardTitle>
          <CardDescription>
            {t('settings.chatPreferencesDesc', 'Configure suas preferências de chat')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.enableAI', 'Ativar IA')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.enableAIDesc', 'Permite que a IA ajude com suas finanças')}
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={toggleAIChat} />
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
    </div>
  );
};

export default PreferencesTab;
