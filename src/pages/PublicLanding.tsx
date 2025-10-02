import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import AuthModal from '../components/auth/AuthModal';

const PublicLanding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const authParam = searchParams.get('auth');
    const tabParam = searchParams.get('tab');
    if (authParam === '1' || tabParam === 'signup' || tabParam === 'login') {
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      <main>
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
