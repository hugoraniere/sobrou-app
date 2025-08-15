import React from 'react';
import TransparentHeader from '../components/header/TransparentHeader';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ModuleTourSection from '../components/landing/ModuleTourSection';
import WhatsAppVoiceSection from '../components/landing/WhatsAppVoiceSection';
import StatementImportSection from '../components/landing/StatementImportSection';
import AutomationAISection from '../components/landing/AutomationAISection';
import SecurityPrivacySection from '../components/landing/SecurityPrivacySection';
import FAQSection from '../components/landing/FAQSection';
import PricingSection from '../components/landing/PricingSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

const PublicLanding: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <TransparentHeader />

      <main className="pt-20 md:pt-24">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ModuleTourSection />
        <WhatsAppVoiceSection />
        <StatementImportSection />
        <AutomationAISection />
        <SecurityPrivacySection />
        <FAQSection />
        <PricingSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLanding;
