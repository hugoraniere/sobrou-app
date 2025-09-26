import React from 'react';
import WhatsAppVoiceSection from '@/components/landing/WhatsAppVoiceSection';

interface InlineWhatsAppVoiceSectionProps {
  onConfigChange: () => void;
}

const InlineWhatsAppVoiceSection: React.FC<InlineWhatsAppVoiceSectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-whatsapp">
      <WhatsAppVoiceSection />
    </div>
  );
};

export default InlineWhatsAppVoiceSection;