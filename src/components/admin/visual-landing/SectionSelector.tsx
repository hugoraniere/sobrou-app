import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Grid3X3, 
  MessageCircle, 
  FileText, 
  Bot, 
  Shield, 
  HelpCircle, 
  Megaphone 
} from 'lucide-react';
import type { SectionData } from '@/pages/admin/VisualLandingPageEditor';

interface SectionSelectorProps {
  sections: SectionData[];
  selectedSection: string;
  onSectionSelect: (sectionKey: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  selectedSection,
  onSectionSelect,
}) => {
  const sectionIcons = {
    hero: Home,
    modules: Grid3X3,
    whatsapp: MessageCircle,
    statement: FileText,
    automation: Bot,
    security: Shield,
    faq: HelpCircle,
    cta: Megaphone,
  };

  const scrollToSection = (sectionKey: string) => {
    const element = document.getElementById(`section-${sectionKey}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handleSectionClick = (sectionKey: string) => {
    onSectionSelect(sectionKey);
    // Delay scroll to allow for selection highlight to render
    setTimeout(() => scrollToSection(sectionKey), 100);
  };

  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const IconComponent = sectionIcons[section.key as keyof typeof sectionIcons] || Home;
        
        return (
          <Button
            key={section.key}
            variant={selectedSection === section.key ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 h-auto p-3 text-left transition-all duration-200',
              selectedSection === section.key 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => handleSectionClick(section.key)}
          >
            <IconComponent className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <div className="font-medium">{section.name}</div>
              <div className={cn(
                'text-xs opacity-70 mt-0.5',
                selectedSection === section.key ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                {getSectionDescription(section.key)}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

const getSectionDescription = (sectionKey: string): string => {
  const descriptions = {
    hero: 'Título principal e apresentação',
    modules: 'Funcionalidades e recursos',
    whatsapp: 'Integração com WhatsApp',
    statement: 'Importação de extratos',
    automation: 'Inteligência artificial',
    security: 'Segurança e privacidade',
    faq: 'Perguntas frequentes',
    cta: 'Chamada para ação final',
  };
  
  return descriptions[sectionKey as keyof typeof descriptions] || 'Seção personalizada';
};

export default SectionSelector;