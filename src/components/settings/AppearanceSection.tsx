
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';
import { toast } from 'sonner';

const AppearanceSection = () => {
  const { t } = useTranslation();
  const [appearance, setAppearance] = React.useState({
    darkMode: false
  });

  const handleToggleDarkMode = () => {
    setAppearance(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
    
    toast.success(t('settings.appearanceUpdated', 'Aparência atualizada com sucesso'));
  };

  return (
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
  );
};

export default AppearanceSection;
