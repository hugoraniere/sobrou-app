
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout, Calculator } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useNavigationPages } from '@/hooks/useNavigationPages';
import { toast } from 'sonner';

const PagesTab = () => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = useNavigation();
  const { optionalPages } = useNavigationPages();

  const handlePageToggle = async (pageKey: string, enabled: boolean) => {
    try {
      await updatePreferences({ [pageKey]: enabled });
      toast.success(
        enabled 
          ? 'Página ativada com sucesso!' 
          : 'Página desativada com sucesso!'
      );
    } catch (error) {
      toast.error('Erro ao atualizar configuração da página');
      console.error('Error updating page preference:', error);
    }
  };

  const getPageDescription = (pageKey: string) => {
    switch (pageKey) {
      case 'restaurant_calculator':
        return 'Ferramenta para calcular custos de pratos e ingredientes para restaurantes';
      default:
        return 'Página opcional do sistema';
    }
  };

  const getPageIcon = (pageKey: string) => {
    switch (pageKey) {
      case 'restaurant_calculator':
        return Calculator;
      default:
        return Layout;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            {t('settings.pagesManagement', 'Gerenciamento de Páginas')}
          </CardTitle>
          <CardDescription>
            {t('settings.pagesManagementDesc', 'Ative ou desative páginas opcionais do sistema conforme sua necessidade')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {optionalPages.map((page) => {
            const pageKey = page.url.replace('/', '').replace('-', '_');
            const Icon = getPageIcon(pageKey);
            const isEnabled = (preferences as any)[pageKey] || false;
            
            return (
              <div key={pageKey} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div className="space-y-1">
                    <Label className="text-base font-medium">{page.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {getPageDescription(pageKey)}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => handlePageToggle(pageKey, checked)}
                />
              </div>
            );
          })}
          
          {optionalPages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma página opcional disponível no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesTab;
