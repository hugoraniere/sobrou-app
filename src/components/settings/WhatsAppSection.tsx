
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const WhatsAppSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          {t('settings.whatsapp', 'Integração WhatsApp')}
        </CardTitle>
        <CardDescription>
          {t('settings.whatsappDescription', 'Registre transações diretamente pelo WhatsApp')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>{t('settings.whatsappStatus', 'Status da Conexão')}</Label>
            <p className="text-sm text-muted-foreground">
              {user?.user_metadata?.whatsapp_number 
                ? t('settings.whatsappConnected', 'Conectado') 
                : t('settings.whatsappNotConnected', 'Não conectado')}
            </p>
          </div>
          
          <Button variant="default" onClick={() => window.location.href = '/whatsapp-integration'}>
            {user?.user_metadata?.whatsapp_number 
              ? t('settings.manageConnection', 'Gerenciar') 
              : t('settings.connectWhatsapp', 'Conectar WhatsApp')}
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <MessageCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                {t('settings.whatsappTips', 'Como usar o WhatsApp')}
              </h4>
              <ul className="text-sm text-blue-600 space-y-2 list-disc list-inside">
                <li>{t('settings.whatsappTip1', 'Envie mensagens como "Gastei R$50 no mercado"')}</li>
                <li>{t('settings.whatsappTip2', 'Transações serão adicionadas automaticamente')}</li>
                <li>{t('settings.whatsappTip3', 'Suporte a várias categorias de despesas')}</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSection;
