import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAvatar } from '@/contexts/AvatarContext';
import ProfileAvatar from './profile/ProfileAvatar';
import ProfileForm from './profile/ProfileForm';

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
          <div className="flex flex-col md:flex-row items-start gap-8">
            <ProfileAvatar
              previewUrl={previewUrl}
              fullName={pendingChanges.fullName}
              isSubmitting={isSubmitting}
              onAvatarUpload={handleAvatarUpload}
              onRemoveAvatar={handleRemoveAvatar}
            />
            
            <ProfileForm
              fullName={pendingChanges.fullName}
              email={user?.email}
              isSubmitting={isSubmitting}
              onFullNameChange={(value) => setPendingChanges(prev => ({ ...prev, fullName: value }))}
              onSave={handleSave}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
