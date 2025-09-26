import React from 'react';
import FAQSection from '@/components/landing/FAQSection';

interface InlineFAQSectionProps {
  onConfigChange: () => void;
}

const InlineFAQSection: React.FC<InlineFAQSectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-faq">
      <FAQSection />
    </div>
  );
};

export default InlineFAQSection;