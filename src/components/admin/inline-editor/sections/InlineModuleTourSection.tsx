import React from 'react';
import ModuleTourSection from '@/components/landing/ModuleTourSection';

interface InlineModuleTourSectionProps {
  onConfigChange: () => void;
}

const InlineModuleTourSection: React.FC<InlineModuleTourSectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-modules">
      <ModuleTourSection />
    </div>
  );
};

export default InlineModuleTourSection;