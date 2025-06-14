
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
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <FeaturesSection />
        <ResourcesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLanding;
