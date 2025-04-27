
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const StatusCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    const checkWhatsAppConnection = async () => {
      if (!user) return;

      // Verificar primeiro nos metadados do usuário
      const metadataNumber = user.user_metadata?.whatsapp_number;
      if (metadataNumber) {
        setWhatsappNumber(formatPhoneNumber(metadataNumber));
        setIsConnected(true);
        return;
      }

      // Se não estiver nos metadados, verificar na tabela de profiles
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.whatsapp_number) {
          setWhatsappNumber(formatPhoneNumber(data.whatsapp_number));
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão WhatsApp:', error);
        setIsConnected(false);
      }
    };

    checkWhatsAppConnection();
  }, [user]);

  // Função para formatar o número de telefone
  const formatPhoneNumber = (number: string) => {
    // Remover caracteres não numéricos
    const numericOnly = number.replace(/\D/g, '');
    
    // Verificar se é um número brasileiro
    if (numericOnly.startsWith('55') && numericOnly.length >= 12) {
      // Formato: +55 (XX) XXXXX-XXXX
      return `+${numericOnly.substring(0, 2)} (${numericOnly.substring(2, 4)}) ${numericOnly.substring(4, 9)}-${numericOnly.substring(9)}`;
    }
    
    // Fallback para outros formatos
    return `+${numericOnly}`;
  };

  if (!isConnected) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('whatsapp.status', 'Status da Conexão')}</CardTitle>
        <CardDescription>
          {t('whatsapp.statusDescription', 'Detalhes da conexão do seu WhatsApp')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="font-medium">{t('whatsapp.active', 'Ativo')}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('whatsapp.phoneNumber', 'Número')}</p>
              <p className="font-medium">{whatsappNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div className="text-green-800">
                <h3 className="font-medium">{t('whatsapp.canReceiveMessages', 'Recebimento habilitado')}</h3>
                <p className="text-sm mt-1">{t('whatsapp.canReceiveMessagesDesc', 'Você pode receber mensagens a qualquer momento.')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div className="text-green-800">
                <h3 className="font-medium">{t('whatsapp.canSendMessages', 'Envio habilitado')}</h3>
                <p className="text-sm mt-1">{t('whatsapp.canSendMessagesDesc', 'Você pode enviar mensagens para registrar transações.')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
