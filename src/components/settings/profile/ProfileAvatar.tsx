
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileAvatarProps {
  previewUrl: string | null;
  fullName: string;
  isSubmitting: boolean;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

const ProfileAvatar = ({
  previewUrl,
  fullName,
  isSubmitting,
  onAvatarUpload,
  onRemoveAvatar
}: ProfileAvatarProps) => {
  const { t } = useTranslation();

  const getUserInitials = () => {
    const name = fullName || t('common.user', 'Usuário');
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <Avatar className="h-32 w-32 ring-2 ring-primary ring-offset-2 mb-4">
        {previewUrl ? (
          <AvatarImage 
            src={previewUrl} 
            alt={fullName}
            className="object-cover" 
          />
        ) : (
          <AvatarFallback className="text-2xl">
            {getUserInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex gap-2 items-center justify-center">
        <label 
          htmlFor="avatar-upload"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/90 cursor-pointer transition-colors"
        >
          <Camera className="h-5 w-5 text-white" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={onAvatarUpload}
            disabled={isSubmitting}
          />
        </label>
        {previewUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="h-10 w-10 rounded-full"
            onClick={onRemoveAvatar}
            disabled={isSubmitting}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
