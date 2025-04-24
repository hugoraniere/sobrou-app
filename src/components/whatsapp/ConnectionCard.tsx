
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ConnectionCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.user_metadata?.whatsapp_number || '');
  const [isConnecting, setIsConnecting] = useState(false);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          {t('whatsapp.connection', 'Conexão WhatsApp')}
        </CardTitle>
        <CardDescription>
          {t('whatsapp.description', 'Conecte seu número de WhatsApp para registrar transações automaticamente')}
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
  );
};

export default ConnectionCard;
