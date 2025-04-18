
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Bell, 
  MessageCircle, 
  Lock,
  Camera
} from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      // Cast para acessar os metadados do usuário
      const userAny = user as any;
      setProfileData({
        fullName: userAny?.user_metadata?.full_name || '',
        email: userAny?.email || '',
      });
    }
  }, [user]);

  const getUserInitials = () => {
    const fullName = profileData.fullName || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileData.fullName }
      });

      if (error) throw error;

      toast.success(t('profile.updateSuccess', 'Perfil atualizado com sucesso'));
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      toast.error(t('profile.updateError', 'Erro ao atualizar o perfil'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title', 'Perfil')}</h1>

      <div className="mb-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-center">{t('profile.avatarTitle', 'Foto do Perfil')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 bg-primary text-white text-2xl">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
                  aria-label={t('profile.changePhoto', 'Alterar foto')}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-lg font-medium">{profileData.fullName}</p>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">
                <User className="h-4 w-4 mr-2" />
                {t('profile.generalTab', 'Geral')}
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                {t('profile.preferencesTab', 'Preferências')}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                {t('profile.notificationsTab', 'Notificações')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.personalInfo', 'Informações Pessoais')}</CardTitle>
                  <CardDescription>{t('profile.personalInfoDesc', 'Atualize suas informações pessoais')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} id="profile-form" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('profile.fullName', 'Nome Completo')}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        placeholder={t('profile.fullNamePlaceholder', 'Digite seu nome completo')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email', 'Email')}</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">{t('profile.emailChangeInfo', 'Email não pode ser alterado')}</p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="submit" 
                    form="profile-form" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? t('common.saving', 'Salvando...') 
                      : t('common.save', 'Salvar Alterações')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.appPreferences', 'Preferências do App')}</CardTitle>
                  <CardDescription>{t('profile.appPreferencesDesc', 'Personalize sua experiência com o aplicativo')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('profile.comingSoon', 'Em breve! Estamos trabalhando para trazer mais opções de personalização.')}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.notificationSettings', 'Configurações de Notificações')}</CardTitle>
                  <CardDescription>{t('profile.notificationSettingsDesc', 'Gerencie como você recebe notificações')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('profile.comingSoon', 'Em breve! Estamos trabalhando para trazer mais opções de personalização.')}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('profile.chatPreferences', 'Preferências de Chat')}
            </CardTitle>
            <CardDescription>{t('profile.chatPreferencesDesc', 'Configure seu assistente financeiro AI')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('profile.comingSoon', 'Em breve! Estamos trabalhando para trazer mais opções de personalização.')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              {t('profile.security', 'Segurança')}
            </CardTitle>
            <CardDescription>{t('profile.securityDesc', 'Gerencie a segurança da sua conta')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('profile.changePassword', 'Alterar Senha')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
