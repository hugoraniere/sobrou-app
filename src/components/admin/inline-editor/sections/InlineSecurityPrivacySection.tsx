import React from 'react';
import SecurityPrivacySection from '@/components/landing/SecurityPrivacySection';

interface InlineSecurityPrivacySectionProps {
  onConfigChange: () => void;
}

const InlineSecurityPrivacySection: React.FC<InlineSecurityPrivacySectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-security">
      <SecurityPrivacySection />
    </div>
  );
};

export default InlineSecurityPrivacySection;