import React from 'react';
import TransparentHeader from '../components/header/TransparentHeader';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ResourcesSection from '../components/landing/ResourcesSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

const PublicLanding: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <TransparentHeader />

      <main className="pt-20 md:pt-24">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>

      <ResourcesSection />
      <Footer />
    </div>
  );
};

export default PublicLanding;
