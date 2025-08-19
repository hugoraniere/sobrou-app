
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsSection = () => {
  const { t } = useTranslation();
  const { preferences, updatePreferences, loading } = useNotifications();

  const handleToggleNotification = async (key: keyof typeof preferences) => {
    try {
      await updatePreferences({ [key]: !preferences[key] });
      toast.success(t('settings.notifications.updated', 'Preferências de notificação atualizadas com sucesso!'));
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error(t('common.error', 'Erro ao atualizar preferências'));
    }
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
            <Label htmlFor="spending-alerts">{t('settings.notifications.spendingAlerts', 'Alertas de gastos')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.spendingAlertsDesc', 'Receba alertas quando seus gastos ultrapassarem limites definidos')}
            </p>
          </div>
          <Switch 
            id="spending-alerts" 
            checked={preferences.spending_alerts}
            onCheckedChange={() => handleToggleNotification('spending_alerts')}
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="goal-achieved">{t('settings.notifications.goalAchieved', 'Metas atingidas')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.goalAchievedDesc', 'Seja notificado quando atingir suas metas financeiras')}
            </p>
          </div>
          <Switch 
            id="goal-achieved" 
            checked={preferences.goal_achieved}
            onCheckedChange={() => handleToggleNotification('goal_achieved')}
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-suggestions">{t('settings.notifications.autoSuggestions', 'Sugestões automáticas')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.autoSuggestionsDesc', 'Receba dicas personalizadas para melhorar suas finanças')}
            </p>
          </div>
          <Switch 
            id="auto-suggestions" 
            checked={preferences.auto_suggestions}
            onCheckedChange={() => handleToggleNotification('auto_suggestions')}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bill-due">{t('settings.notifications.billDue', 'Lembrete de contas')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.billDueDesc', 'Receba lembretes no dia do vencimento das contas')}
            </p>
          </div>
          <Switch 
            id="bill-due" 
            checked={preferences.bill_due}
            onCheckedChange={() => handleToggleNotification('bill_due')}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
