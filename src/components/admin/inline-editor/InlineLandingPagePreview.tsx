import React from 'react';
import { cn } from '@/lib/utils';
import { LandingPageProvider } from '@/contexts/LandingPageContext';
import InlineHeroSection from './sections/InlineHeroSection';
import InlineModuleTourSection from './sections/InlineModuleTourSection';
import InlineWhatsAppVoiceSection from './sections/InlineWhatsAppVoiceSection';
import InlineStatementImportSection from './sections/InlineStatementImportSection';
import InlineAutomationAISection from './sections/InlineAutomationAISection';
import InlineSecurityPrivacySection from './sections/InlineSecurityPrivacySection';
import InlineFAQSection from './sections/InlineFAQSection';
import InlineCtaSection from './sections/InlineCtaSection';
import TransparentHeader from '../../header/TransparentHeader';
import Footer from '../../landing/Footer';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface InlineLandingPagePreviewProps {
  viewportSize: ViewportSize;
  onConfigChange: () => void;
}

const InlineLandingPagePreview: React.FC<InlineLandingPagePreviewProps> = ({
  viewportSize,
  onConfigChange
}) => {
  const getViewportStyles = () => {
    switch (viewportSize) {
      case 'desktop':
        return 'max-w-none';
      case 'tablet':
        return 'max-w-4xl mx-auto';
      case 'mobile':
        return 'max-w-sm mx-auto';
      default:
        return 'max-w-none';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingPageProvider>
        <div 
          className={cn(
            'transition-all duration-300 ease-in-out min-h-screen',
            getViewportStyles()
          )}
          style={{
            paddingTop: viewportSize !== 'desktop' ? '80px' : '0',
            paddingBottom: viewportSize !== 'desktop' ? '20px' : '0'
          }}
        >
          <TransparentHeader />

          <main>
            <InlineHeroSection onConfigChange={onConfigChange} />
            <InlineModuleTourSection onConfigChange={onConfigChange} />
            <InlineWhatsAppVoiceSection onConfigChange={onConfigChange} />
            <InlineStatementImportSection onConfigChange={onConfigChange} />
            <InlineAutomationAISection onConfigChange={onConfigChange} />
            <InlineSecurityPrivacySection onConfigChange={onConfigChange} />
            <InlineFAQSection onConfigChange={onConfigChange} />
            <InlineCtaSection onConfigChange={onConfigChange} />
          </main>

          <Footer />
        </div>
      </LandingPageProvider>
    </div>
  );
};

export default InlineLandingPagePreview;