
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
    <div className="relative">
      <Avatar className="h-32 w-32 ring-2 ring-primary ring-offset-2">
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
            onChange={onAvatarUpload}
            disabled={isSubmitting}
          />
        </label>
        {previewUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full"
            onClick={onRemoveAvatar}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
