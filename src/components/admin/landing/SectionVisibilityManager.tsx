import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { Eye, EyeOff } from 'lucide-react';

const SectionVisibilityManager: React.FC = () => {
  const { configs, updateConfig } = useLandingPage();

  const sectionNames: Record<string, string> = {
    hero: 'Seção Hero',
    modules: 'Módulos de Funcionalidades',
    whatsapp: 'Seção WhatsApp',
    statement_import: 'Importação de Extratos',
    automation: 'IA e Automação',
    security: 'Segurança e Privacidade',
    faq: 'Perguntas Frequentes',
    cta: 'Call-to-Action Final'
  };

  const handleVisibilityChange = async (sectionKey: string, isVisible: boolean) => {
    const config = configs.find(c => c.section_key === sectionKey);
    if (config) {
      await updateConfig(sectionKey, config.content, isVisible);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Controle quais seções são exibidas na landing page. As seções ocultas não aparecerão para os visitantes.
      </p>

      <div className="grid gap-4">
        {configs.map((config) => {
          const sectionName = sectionNames[config.section_key] || config.section_key;
          
          return (
            <Card key={config.section_key}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {config.is_visible ? (
                      <Eye className="w-5 h-5 text-green-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label className="text-base font-medium">
                        {sectionName}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {config.is_visible ? 'Visível na landing page' : 'Oculta na landing page'}
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={config.is_visible}
                    onCheckedChange={(checked) => 
                      handleVisibilityChange(config.section_key, checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">💡 Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use a funcionalidade de visibilidade para testar diferentes versões da sua landing page 
            ou para ocultar temporariamente seções que estão sendo atualizadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionVisibilityManager;