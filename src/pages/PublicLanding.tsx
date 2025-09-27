import React from 'react';
import SiteNavbar from '../components/navigation/SiteNavbar';
import HeroSection from '../components/landing/HeroSection';
import ModuleTourSection from '../components/landing/ModuleTourSection';
import WhatsAppVoiceSection from '../components/landing/WhatsAppVoiceSection';
import StatementImportSection from '../components/landing/StatementImportSection';
import AutomationAISection from '../components/landing/AutomationAISection';
import SecurityPrivacySection from '../components/landing/SecurityPrivacySection';
import FAQSection from '../components/landing/FAQSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

const PublicLanding: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />

      <main className="pt-20">
        <HeroSection />
        <ModuleTourSection />
        <WhatsAppVoiceSection />
        <StatementImportSection />
        <AutomationAISection />
        <SecurityPrivacySection />
        <FAQSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLanding;
