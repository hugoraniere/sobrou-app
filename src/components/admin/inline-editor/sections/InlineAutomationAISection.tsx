import React from 'react';
import AutomationAISection from '@/components/landing/AutomationAISection';

interface InlineAutomationAISectionProps {
  onConfigChange: () => void;
}

const InlineAutomationAISection: React.FC<InlineAutomationAISectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-automation">
      <AutomationAISection />
    </div>
  );
};

export default InlineAutomationAISection;