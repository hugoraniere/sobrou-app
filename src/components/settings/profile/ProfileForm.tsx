
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  fullName: string;
  email: string | undefined;
  isSubmitting: boolean;
  onFullNameChange: (value: string) => void;
  onSave: () => void;
}

const ProfileForm = ({
  fullName,
  email,
  isSubmitting,
  onFullNameChange,
  onSave
}: ProfileFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 flex-1">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('settings.fullName', 'Nome Completo')}</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('settings.email', 'Email')}</Label>
        <Input
          id="email"
          value={email || ''}
          disabled
        />
        <p className="text-sm text-muted-foreground">
          {t('settings.emailChangeInfo', 'Email não pode ser alterado')}
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          onClick={onSave}
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
  );
};

export default ProfileForm;
