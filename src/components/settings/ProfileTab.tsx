
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAvatar } from '@/contexts/AvatarContext';

const ProfileTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateAvatarUrl } = useAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  const getUserInitials = () => {
    const fullName = profileData.fullName || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const deleteOldAvatar = async (oldUrl: string) => {
    try {
      const path = oldUrl.split('/').pop();
      if (path) {
        await supabase.storage.from('avatars').remove([path]);
      }
    } catch (error) {
      console.error('Error deleting old avatar:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Delete old avatar if exists
      if (profileData.avatarUrl) {
        await deleteOldAvatar(profileData.avatarUrl);
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: publicUrl,
          full_name: profileData.fullName 
        }
      });

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
      updateAvatarUrl(publicUrl);
      toast.success(t('settings.avatarUpdated', 'Foto atualizada com sucesso'));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(t('settings.avatarError', 'Erro ao atualizar foto'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      if (profileData.avatarUrl) {
        await deleteOldAvatar(profileData.avatarUrl);
      }

      const { error } = await supabase.auth.updateUser({
        data: { 
          avatar_url: null,
          full_name: profileData.fullName 
        }
      });

      if (error) throw error;

      setProfileData(prev => ({ ...prev, avatarUrl: '' }));
      updateAvatarUrl(null);
      toast.success(t('settings.avatarRemoved', 'Foto removida com sucesso'));
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error(t('settings.avatarRemoveError', 'Erro ao remover foto'));
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileData.fullName,
          avatar_url: profileData.avatarUrl || null
        }
      });

      if (error) throw error;

      setIsEditing(false);
      toast.success(t('settings.profileUpdated', 'Perfil atualizado com sucesso'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('settings.updateError', 'Erro ao atualizar perfil'));
    }
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
                {profileData.avatarUrl ? (
                  <AvatarImage 
                    src={profileData.avatarUrl} 
                    alt={profileData.fullName}
                    className="object-cover" 
                  />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-4 right-0 flex gap-2">
                <label 
                  htmlFor="avatar-upload"
                  className="rounded-full p-2 bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </label>
                {profileData.avatarUrl && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
