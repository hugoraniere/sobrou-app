import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useSafeAuth } from '@/hooks/useSafeAuth';
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
  const { isAuthenticated, isLoading } = useSafeAuth();
  const [searchParams] = useSearchParams();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'signup'>('login');

  // Redirect authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const auth = searchParams.get('auth');
    const tab = searchParams.get('tab');
    
    if (auth === '1' || tab === 'signup' || tab === 'login') {
      setAuthModalOpen(true);
      if (tab === 'signup') {
        setDefaultTab('signup');
      } else {
        setDefaultTab('login');
      }
    }
  }, [searchParams]);

  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab={defaultTab}
      />

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
