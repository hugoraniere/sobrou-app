import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { LandingPageProvider } from '@/contexts/LandingPageContext';
import HeroSection from '@/components/landing/HeroSection';
import ModuleTourSection from '@/components/landing/ModuleTourSection';
import WhatsAppVoiceSection from '@/components/landing/WhatsAppVoiceSection';
import StatementImportSection from '@/components/landing/StatementImportSection';
import AutomationAISection from '@/components/landing/AutomationAISection';
import SecurityPrivacySection from '@/components/landing/SecurityPrivacySection';
import FAQSection from '@/components/landing/FAQSection';
import CtaSection from '@/components/landing/CtaSection';
import type { SectionData } from '@/pages/admin/VisualLandingPageEditor';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface LandingPagePreviewProps {
  selectedSection: string;
  onSectionSelect: (sectionKey: string) => void;
  viewportSize: ViewportSize;
  sections: SectionData[];
}

const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  selectedSection,
  onSectionSelect,
  viewportSize,
  sections,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const getViewportStyles = () => {
    switch (viewportSize) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '100%',
          margin: '0 auto',
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          overflow: 'hidden',
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '100%',
          margin: '0 auto',
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          overflow: 'hidden',
        };
      default:
        return {
          width: '100%',
          minHeight: '100%',
        };
    }
  };

  const sectionComponents = {
    hero: HeroSection,
    modules: ModuleTourSection,
    whatsapp: WhatsAppVoiceSection,
    statement: StatementImportSection,
    automation: AutomationAISection,
    security: SecurityPrivacySection,
    faq: FAQSection,
    cta: CtaSection,
  };

  const handleSectionClick = (e: React.MouseEvent, sectionKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSectionSelect(sectionKey);
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm overflow-auto">
      <div
        ref={previewRef}
        style={getViewportStyles()}
        className="bg-white"
      >
        <LandingPageProvider>
          {sections.map((section) => {
            const SectionComponent = sectionComponents[section.key as keyof typeof sectionComponents];
            
            if (!SectionComponent) return null;

            return (
              <div
                key={section.key}
                id={`section-${section.key}`}
                className={cn(
                  'relative transition-all duration-200 cursor-pointer',
                  selectedSection === section.key && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={(e) => handleSectionClick(e, section.key)}
              >
                {/* Overlay for selection */}
                <div
                  className={cn(
                    'absolute inset-0 z-10 pointer-events-none transition-all duration-200',
                    selectedSection === section.key
                      ? 'bg-primary/5 border-2 border-primary'
                      : 'hover:bg-primary/[0.02] hover:border hover:border-primary/20'
                  )}
                />
                
                {/* Section Label */}
                {selectedSection === section.key && (
                  <div className="absolute top-2 left-2 z-20 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    {section.name}
                  </div>
                )}
                
                <SectionComponent />
              </div>
            );
          })}
        </LandingPageProvider>
      </div>
    </div>
  );
};

export default LandingPagePreview;