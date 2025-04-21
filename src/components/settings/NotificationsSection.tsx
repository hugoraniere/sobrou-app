
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  spendingAlerts: boolean;
  goalAchieved: boolean;
  autoSuggestions: boolean;
}

const NotificationsSection = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState<NotificationSettings>({
    spendingAlerts: true,
    goalAchieved: true,
    autoSuggestions: false
  });

  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success(t('settings.preferencesUpdated', 'Preferências atualizadas com sucesso'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          {t('settings.notifications', 'Notificações')}
        </CardTitle>
        <CardDescription>
          {t('settings.notificationsDescription', 'Controle quais alertas você deseja receber')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="spending-alerts">{t('settings.spendingAlerts', 'Alertas de gastos')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.spendingAlertsDescription', 'Receba alertas quando seus gastos ultrapassarem limites definidos')}
            </p>
          </div>
          <Switch 
            id="spending-alerts" 
            checked={notifications.spendingAlerts}
            onCheckedChange={() => handleToggleNotification('spendingAlerts')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="goal-achieved">{t('settings.goalAchieved', 'Metas atingidas')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.goalAchievedDescription', 'Seja notificado quando atingir suas metas financeiras')}
            </p>
          </div>
          <Switch 
            id="goal-achieved" 
            checked={notifications.goalAchieved}
            onCheckedChange={() => handleToggleNotification('goalAchieved')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-suggestions">{t('settings.autoSuggestions', 'Sugestões automáticas')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.autoSuggestionsDescription', 'Receba dicas personalizadas para melhorar suas finanças')}
            </p>
          </div>
          <Switch 
            id="auto-suggestions" 
            checked={notifications.autoSuggestions}
            onCheckedChange={() => handleToggleNotification('autoSuggestions')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
