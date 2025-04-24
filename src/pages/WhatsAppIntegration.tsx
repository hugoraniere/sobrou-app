
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionCard from '@/components/whatsapp/ConnectionCard';
import StatusCard from '@/components/whatsapp/StatusCard';
import InstructionsCard from '@/components/whatsapp/InstructionsCard';

const WhatsAppIntegration = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('whatsapp.integration', 'Integração WhatsApp')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard />
        <InstructionsCard />
      </div>
      
      <StatusCard />
    </div>
  );
};

export default WhatsAppIntegration;
