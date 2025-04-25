
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAvatar } from '@/contexts/AvatarContext';

type PendingChanges = {
  fullName: string;
  avatarFile: File | null;
  shouldDeleteAvatar: boolean;
};

const ProfileTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateAvatarUrl } = useAvatar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    fullName: user?.user_metadata?.full_name || '',
    avatarFile: null,
    shouldDeleteAvatar: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url || null
  );

  const getUserInitials = () => {
    const fullName = pendingChanges.fullName || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingChanges(prev => ({
      ...prev,
      avatarFile: file,
      shouldDeleteAvatar: false,
    }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setPendingChanges(prev => ({
      ...prev,
      avatarFile: null,
      shouldDeleteAvatar: true,
    }));
    setPreviewUrl(null);
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

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let newAvatarUrl = user?.user_metadata?.avatar_url;

      // Handle avatar changes
      if (pendingChanges.shouldDeleteAvatar) {
        if (newAvatarUrl) {
          await deleteOldAvatar(newAvatarUrl);
        }
        newAvatarUrl = null;
      } else if (pendingChanges.avatarFile) {
        // Delete old avatar if it exists
        if (newAvatarUrl) {
          await deleteOldAvatar(newAvatarUrl);
        }

        // Upload new avatar
        const fileExt = pendingChanges.avatarFile.name.split('.').pop();
        const fileName = `${user?.id}/${uuidv4()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, pendingChanges.avatarFile, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        newAvatarUrl = publicUrl;
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: newAvatarUrl,
          full_name: pendingChanges.fullName 
        }
      });

      if (updateError) throw updateError;

      // Update avatar context
      updateAvatarUrl(newAvatarUrl);

      // Reset pending changes
      setPendingChanges({
        fullName: pendingChanges.fullName,
        avatarFile: null,
        shouldDeleteAvatar: false,
      });

      toast.success(t('settings.profileUpdated', 'Perfil atualizado com sucesso'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('settings.updateError', 'Erro ao atualizar perfil'));
    } finally {
      setIsSubmitting(false);
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
                {previewUrl ? (
                  <AvatarImage 
                    src={previewUrl} 
                    alt={pendingChanges.fullName}
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
                    disabled={isSubmitting}
                  />
                </label>
                {previewUrl && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    onClick={handleRemoveAvatar}
                    disabled={isSubmitting}
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
                  value={pendingChanges.fullName}
                  onChange={(e) => setPendingChanges(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.email', 'Email')}</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {t('settings.emailChangeInfo', 'Email não pode ser alterado')}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.saving', 'Salvando...')}
                    </>
                  ) : (
                    t('common.save', 'Salvar')
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
