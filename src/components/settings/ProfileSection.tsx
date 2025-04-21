
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ProfileSectionProps {
  onEditClick: () => void;
}

const ProfileSection = ({ onEditClick }: ProfileSectionProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onEditClick}
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
  );
};

export default ProfileSection;
