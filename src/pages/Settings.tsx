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
  UserCog, 
  Key, 
  Shield, 
  Bell, 
  Moon, 
  Palette, 
  LogOut, 
  Trash2,
  MessageCircle,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
    const fullName = (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário');
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
        <h1 className="text-3xl font-bold">{t('settings.title', 'Configurações')}</h1>
        <p className="text-gray-600 mt-2">
          {t('settings.subtitle', 'Gerencie suas preferências e configurações de conta')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCog className="h-5 w-5 mr-2" />
              {t('settings.accountInfo', 'Informações da Conta')}
            </CardTitle>
            <CardDescription>
              {t('settings.accountDescription', 'Gerencie suas informações pessoais')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-blue-500 text-white">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">
                  {(user as any)?.user_metadata?.full_name || t('common.user', 'Usuário')}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">
              {t('settings.editProfile', 'Editar Perfil')}
            </Button>
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              {t('settings.changePassword', 'Alterar Senha')}
            </Button>
          </CardFooter>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              {t('settings.security', 'Segurança')}
            </CardTitle>
            <CardDescription>
              {t('settings.securityDescription', 'Gerenciar opções de segurança da sua conta')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              {t('settings.enable2FA', 'Ativar autenticação em dois fatores')}
            </Button>
            
            <Button variant="outline" className="w-full text-orange-500 hover:bg-orange-50 hover:text-orange-600">
              <LogOut className="h-4 w-4 mr-2" />
              {t('settings.logoutAllSessions', 'Sair de todas as sessões')}
            </Button>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('settings.whatsapp', 'Integração WhatsApp')}
            </CardTitle>
            <CardDescription>
              {t('settings.whatsappDescription', 'Registre transações diretamente pelo WhatsApp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t('settings.whatsappStatus', 'Status da Conexão')}</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.user_metadata?.whatsapp_number 
                    ? t('settings.whatsappConnected', 'Conectado') 
                    : t('settings.whatsappNotConnected', 'Não conectado')}
                </p>
              </div>
              
              <Link to="/integration">
                <Button variant="outline">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {user?.user_metadata?.whatsapp_number 
                    ? t('settings.manageConnection', 'Gerenciar') 
                    : t('settings.connectWhatsapp', 'Conectar')}
                </Button>
              </Link>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">
                    {t('settings.whatsappTips', 'Como usar o WhatsApp')}
                  </h4>
                  <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
                    <li>{t('settings.whatsappTip1', 'Envie mensagens como "Gastei R$50 no mercado"')}</li>
                    <li>{t('settings.whatsappTip2', 'Transações serão adicionadas automaticamente')}</li>
                    <li>{t('settings.whatsappTip3', 'Suporte a várias categorias de despesas')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
