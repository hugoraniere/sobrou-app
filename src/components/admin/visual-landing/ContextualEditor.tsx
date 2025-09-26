import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroEditor from '@/components/admin/landing/HeroEditor';
import ModulesEditor from '@/components/admin/landing/ModulesEditor';
import WhatsAppEditor from '@/components/admin/landing/WhatsAppEditor';
import StatementImportEditor from '@/components/admin/landing/StatementImportEditor';
import AutomationEditor from '@/components/admin/landing/AutomationEditor';
import SecurityEditor from '@/components/admin/landing/SecurityEditor';
import FAQEditor from '@/components/admin/landing/FAQEditor';
import CtaEditor from '@/components/admin/landing/CtaEditor';
import SectionVisibilityManager from '@/components/admin/landing/SectionVisibilityManager';
import { Settings, Eye, EyeOff } from 'lucide-react';
import type { SectionData } from '@/pages/admin/VisualLandingPageEditor';

interface ContextualEditorProps {
  selectedSection: string;
  sections: SectionData[];
  onConfigChange: () => void;
}

const ContextualEditor: React.FC<ContextualEditorProps> = ({
  selectedSection,
  sections,
  onConfigChange,
}) => {
  const selectedSectionData = sections.find(s => s.key === selectedSection);

  const getEditorComponent = () => {
    switch (selectedSection) {
      case 'hero':
        return <HeroEditor />;
      case 'modules':
        return <ModulesEditor />;
      case 'whatsapp':
        return <WhatsAppEditor />;
      case 'statement':
        return <StatementImportEditor />;
      case 'automation':
        return <AutomationEditor />;
      case 'security':
        return <SecurityEditor />;
      case 'faq':
        return <FAQEditor />;
      case 'cta':
        return <CtaEditor />;
      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Selecione uma seção para editar</p>
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    const titles = {
      hero: 'Seção Hero',
      modules: 'Módulos de Funcionalidades',
      whatsapp: 'Seção WhatsApp',
      statement: 'Importação de Extratos',
      automation: 'IA e Automação',
      security: 'Segurança e Privacidade',
      faq: 'Perguntas Frequentes',
      cta: 'Call-to-Action Final',
    };
    
    return titles[selectedSection as keyof typeof titles] || 'Configurações';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {getSectionTitle()}
          </h2>
          <Badge variant="outline" className="text-xs">
            {selectedSectionData?.name || 'Seção'}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Edite o conteúdo desta seção. As alterações aparecerão no preview em tempo real.
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SectionVisibilityManager />
        </CardContent>
      </Card>

      {/* Editor Content */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            {getEditorComponent()}
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card className="bg-accent/30 border-accent">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <strong>Dica:</strong> Use Ctrl+S para salvar rapidamente ou clique em "Salvar Mudanças" no cabeçalho quando terminar de editar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextualEditor;