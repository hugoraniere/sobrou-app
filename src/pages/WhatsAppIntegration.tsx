
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionCard from '@/components/whatsapp/ConnectionCard';
import StatusCard from '@/components/whatsapp/StatusCard';
import InstructionsCard from '@/components/whatsapp/InstructionsCard';
import DebugCard from '@/components/whatsapp/DebugCard';
import { useAuth } from '@/contexts/AuthContext';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const WhatsAppIntegration = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isWhatsAppConnected = Boolean(user?.user_metadata?.whatsapp_number);

  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader 
        title={t('whatsapp.integration', 'Integração WhatsApp')}
        description={t('whatsapp.integrationDesc', 'Registre transações facilmente através do WhatsApp')}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard />
        <InstructionsCard />
      </div>
      
      <StatusCard />
      
      <DebugCard />
    </ResponsivePageContainer>
  );
};

export default WhatsAppIntegration;
