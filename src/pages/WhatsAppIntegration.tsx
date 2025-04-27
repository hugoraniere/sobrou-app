
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionCard from '@/components/whatsapp/ConnectionCard';
import StatusCard from '@/components/whatsapp/StatusCard';
import InstructionsCard from '@/components/whatsapp/InstructionsCard';
import DebugCard from '@/components/whatsapp/DebugCard';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppIntegration = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isWhatsAppConnected = Boolean(user?.user_metadata?.whatsapp_number);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{t('whatsapp.integration', 'Integração WhatsApp')}</h1>
      <p className="text-muted-foreground mb-6">
        {t('whatsapp.integrationDesc', 'Registre transações facilmente através do WhatsApp')}
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard />
        <InstructionsCard />
      </div>
      
      <StatusCard />
      
      <DebugCard />
    </div>
  );
};

export default WhatsAppIntegration;
