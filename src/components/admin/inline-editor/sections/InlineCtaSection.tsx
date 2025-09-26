import React from 'react';
import CtaSection from '@/components/landing/CtaSection';

interface InlineCtaSectionProps {
  onConfigChange: () => void;
}

const InlineCtaSection: React.FC<InlineCtaSectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-cta">
      <CtaSection />
    </div>
  );
};

export default InlineCtaSection;