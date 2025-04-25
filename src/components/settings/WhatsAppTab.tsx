import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const WhatsAppTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = React.useState(user?.user_metadata?.whatsapp_number || '');
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleWhatsAppConnection = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error(t('whatsapp.errorEmptyNumber', 'Por favor, insira um número de telefone válido'));
      return;
    }

    try {
      setIsConnecting(true);
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      const { error } = await supabase.auth.updateUser({
        data: { whatsapp_number: formattedNumber }
      });

      if (error) throw error;
      
      toast.success(t('whatsapp.successConnection', 'WhatsApp conectado com sucesso!'));
    } catch (error: any) {
      console.error('WhatsApp connection error:', error);
      toast.error(error.message || t('whatsapp.errorConnection', 'Erro ao conectar WhatsApp'));
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('whatsapp.connection', 'Conexão WhatsApp')}
          </CardTitle>
          <CardDescription>
            {t('whatsapp.description', 'Conecte seu WhatsApp para registrar transações automaticamente')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="+55 (11) 98765-4321"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t('whatsapp.phoneNumberHint', 'Inclua o código do país e DDD')}
            </p>
          </div>
          
          <Button onClick={handleWhatsAppConnection} disabled={isConnecting}>
            {isConnecting ? t('whatsapp.connecting', 'Conectando...') : t('whatsapp.connect', 'Conectar')}
          </Button>
        </CardContent>
      </Card>

      {user?.user_metadata?.whatsapp_number && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t('whatsapp.status', 'Status')}
            </CardTitle>
            <CardDescription>
              {t('whatsapp.statusDescription', 'Seu número está conectado')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <p className="text-green-700">
                  {t('whatsapp.connected', 'Conectado')}: {user.user_metadata.whatsapp_number}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('whatsapp.howToUse', 'Como usar')}</CardTitle>
          <CardDescription>
            {t('whatsapp.howToUseDesc', 'Instruções para usar o WhatsApp')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">
                {t('whatsapp.examples', 'Exemplos de mensagens')}
              </h3>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-sm">Gastei R$50 no mercado</p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-sm">Recebi R$1000 de salário</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTab;
