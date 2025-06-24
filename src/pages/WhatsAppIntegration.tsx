
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionCard from '@/components/whatsapp/ConnectionCard';
import StatusCard from '@/components/whatsapp/StatusCard';
import InstructionsCard from '@/components/whatsapp/InstructionsCard';
import DebugCard from '@/components/whatsapp/DebugCard';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const WhatsAppIntegration = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const isWhatsAppConnected = Boolean(user?.user_metadata?.whatsapp_number);

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4" : "container mx-auto max-w-screen-xl"
    )}>
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-bold">{t('whatsapp.integration', 'Integração WhatsApp')}</h1>
        <p className="text-muted-foreground">
          {t('whatsapp.integrationDesc', 'Registre transações facilmente através do WhatsApp')}
        </p>
      </div>
      
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
