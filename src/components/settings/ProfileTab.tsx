
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

const ProfileTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });

  const getUserInitials = () => {
    const fullName = profileData.fullName || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleSave = () => {
    // Here you would typically save the changes
    setIsEditing(false);
    toast.success(t('settings.profileUpdated', 'Perfil atualizado com sucesso'));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.personalInfo', 'Informações Pessoais')}</CardTitle>
          <CardDescription>
            {t('settings.personalInfoDesc', 'Gerencie suas informações pessoais')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('settings.fullName', 'Nome Completo')}</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.email', 'Email')}</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {t('settings.emailChangeInfo', 'Email não pode ser alterado')}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t('common.cancel', 'Cancelar')}
                    </Button>
                    <Button onClick={handleSave}>
                      {t('common.save', 'Salvar')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    {t('common.edit', 'Editar')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
