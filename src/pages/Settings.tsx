import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  Moon, 
  Palette, 
  LogOut, 
  Trash2,
  MessageCircle,
  UserCog
} from 'lucide-react';
import { toast } from 'sonner';
import ProfileEditDialog from '@/components/profile/ProfileEditDialog';

const Settings = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notifications, setNotifications] = useState({
    spendingAlerts: true,
    goalAchieved: true,
    autoSuggestions: false
  });
  const [appearance, setAppearance] = useState({
    darkMode: false
  });
  
  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleDeleteAccount = () => {
    toast.success(t('settings.accountDeleted', 'Conta excluída com sucesso'));
    setIsDeleteDialogOpen(false);
    logout();
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success(t('settings.preferencesUpdated', 'Preferências atualizadas com sucesso'));
  };

  const handleToggleDarkMode = () => {
    setAppearance(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
    
    toast.success(t('settings.appearanceUpdated', 'Aparência atualizada com sucesso'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsProfileEditOpen(true)}
            className="group flex items-center"
          >
            <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {user?.user_metadata?.full_name || t('common.user', 'Usuário')}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp Integration Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('settings.whatsapp', 'Integração WhatsApp')}
            </CardTitle>
            <CardDescription>
              {t('settings.whatsappDescription', 'Registre transações diretamente pelo WhatsApp')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t('settings.whatsappStatus', 'Status da Conexão')}</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.user_metadata?.whatsapp_number 
                    ? t('settings.whatsappConnected', 'Conectado') 
                    : t('settings.whatsappNotConnected', 'Não conectado')}
                </p>
              </div>
              
              <Button variant="default" onClick={() => window.location.href = '/integration'}>
                {user?.user_metadata?.whatsapp_number 
                  ? t('settings.manageConnection', 'Gerenciar') 
                  : t('settings.connectWhatsapp', 'Conectar WhatsApp')}
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">
                    {t('settings.whatsappTips', 'Como usar o WhatsApp')}
                  </h4>
                  <ul className="text-sm text-blue-600 space-y-2 list-disc list-inside">
                    <li>{t('settings.whatsappTip1', 'Envie mensagens como "Gastei R$50 no mercado"')}</li>
                    <li>{t('settings.whatsappTip2', 'Transações serão adicionadas automaticamente')}</li>
                    <li>{t('settings.whatsappTip3', 'Suporte a várias categorias de despesas')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
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

        {/* Appearance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              {t('settings.appearance', 'Aparência')}
            </CardTitle>
            <CardDescription>
              {t('settings.appearanceDescription', 'Personalize a aparência do aplicativo')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">{t('settings.darkMode', 'Modo escuro')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.darkModeDescription', 'Alterne entre tema claro e escuro')}
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={appearance.darkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <Trash2 className="h-5 w-5 mr-2" />
              {t('settings.dangerZone', 'Zona de Perigo')}
            </CardTitle>
            <CardDescription>
              {t('settings.dangerZoneDescription', 'Ações irreversíveis para sua conta')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('settings.deleteAccount', 'Excluir minha conta permanentemente')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('settings.confirmDeletion', 'Confirmar exclusão')}</DialogTitle>
                  <DialogDescription>
                    {t('settings.deleteWarning', 'Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                  <Switch id="confirm-delete" checked={confirmDelete} onCheckedChange={setConfirmDelete} />
                  <Label htmlFor="confirm-delete" className="font-medium text-red-500">
                    {t('settings.confirmDeletionText', 'Confirmo que desejo excluir minha conta permanentemente')}
                  </Label>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    {t('common.cancel', 'Cancelar')}
                  </Button>
                  <Button variant="destructive" disabled={!confirmDelete} onClick={handleDeleteAccount}>
                    {t('settings.deleteAccount', 'Excluir minha conta permanentemente')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <ProfileEditDialog 
        isOpen={isProfileEditOpen} 
        onClose={() => setIsProfileEditOpen(false)} 
      />
    </div>
  );
};

export default Settings;
