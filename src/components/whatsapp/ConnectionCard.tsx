
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ConnectionCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  useEffect(() => {
    // Verificar se o usuário tem um número WhatsApp associado
    if (user) {
      // Primeiro verificar nos metadados do usuário
      const whatsappNumber = user?.user_metadata?.whatsapp_number;
      if (whatsappNumber) {
        setPhoneNumber(whatsappNumber);
        setConnectionStatus('connected');
        return;
      }

      // Se não estiver nos metadados, verificar na tabela de profiles
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('whatsapp_number')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data?.whatsapp_number) {
            setPhoneNumber(data.whatsapp_number);
            setConnectionStatus('connected');
          } else {
            setConnectionStatus('disconnected');
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          setConnectionStatus('disconnected');
        }
      };

      fetchProfile();
    } else {
      setConnectionStatus('disconnected');
    }
  }, [user]);

  const handleWhatsAppConnection = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error(t('whatsapp.errorEmptyNumber', 'Por favor, insira um número de telefone válido'));
      return;
    }

    try {
      setIsConnecting(true);
      // Formatar o número removendo caracteres não numéricos
      let formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Garantir que o número tem o formato internacional
      if (!formattedNumber.startsWith('55') && formattedNumber.length <= 11) {
        formattedNumber = '55' + formattedNumber;
      }
      
      // Atualizar o metadado do usuário
      const { error: userError } = await supabase.auth.updateUser({
        data: { whatsapp_number: formattedNumber }
      });

      if (userError) throw userError;

      // Também atualizar o perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          whatsapp_number: formattedNumber
        });

      if (profileError) throw profileError;
      
      // Enviar mensagem de boas-vindas através da função do Supabase
      try {
        await supabase.functions.invoke('send-whatsapp-welcome', {
          body: { phone: formattedNumber }
        });
        toast.success(t('whatsapp.successWelcomeMessage', 'Mensagem de boas-vindas enviada!'));
      } catch (welcomeError) {
        console.error('Erro ao enviar mensagem de boas-vindas:', welcomeError);
      }
      
      setConnectionStatus('connected');
      toast.success(t('whatsapp.successConnection', 'WhatsApp conectado com sucesso!'));
    } catch (error: any) {
      console.error('WhatsApp connection error:', error);
      toast.error(error.message || t('whatsapp.errorConnection', 'Erro ao conectar WhatsApp'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    try {
      setIsDisconnecting(true);
      
      // Remove WhatsApp number from user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { whatsapp_number: null }
      });

      if (userError) throw userError;

      // Remove WhatsApp number from profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ whatsapp_number: null })
        .eq('id', user?.id);

      if (profileError) throw profileError;
      
      setConnectionStatus('disconnected');
      setPhoneNumber('');
      toast.success(t('whatsapp.disconnectionSuccess', 'WhatsApp desconectado com sucesso!'));
    } catch (error: any) {
      console.error('WhatsApp disconnection error:', error);
      toast.error(error.message || t('whatsapp.errorDisconnection', 'Erro ao desconectar WhatsApp'));
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('whatsapp.connection', 'Conexão WhatsApp')}
          
          {connectionStatus !== 'loading' && (
            <Badge variant={connectionStatus === 'connected' ? "success" : "outline"} className="ml-2">
              {connectionStatus === 'connected' 
                ? t('whatsapp.connected', 'Conectado') 
                : t('whatsapp.disconnected', 'Desconectado')}
            </Badge>
          )}
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
            disabled={connectionStatus === 'connected'}
          />
          <p className="text-sm text-muted-foreground">
            {t('whatsapp.phoneNumberHint', 'Inclua o código do país e DDD')}
          </p>
        </div>
        
        {connectionStatus === 'connected' ? (
          <Button 
            onClick={handleDisconnectWhatsApp} 
            variant="destructive"
            disabled={isDisconnecting}
            className="w-full flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            {isDisconnecting 
              ? t('whatsapp.disconnecting', 'Desconectando...') 
              : t('whatsapp.disconnect', 'Desconectar WhatsApp')}
          </Button>
        ) : (
          <Button 
            onClick={handleWhatsAppConnection} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting 
              ? t('whatsapp.connecting', 'Conectando...') 
              : t('whatsapp.connect', 'Conectar')}
          </Button>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="bg-green-50 border border-green-100 rounded p-3 mt-2 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-medium">{t('whatsapp.connectionSuccessful', 'Conexão bem-sucedida!')}</p>
              <p className="mt-1">{t('whatsapp.startSendingMessages', 'Agora você pode enviar mensagens para o número do WhatsApp Business para registrar transações.')}</p>
            </div>
          </div>
        )}
        
        {connectionStatus === 'disconnected' && (
          <div className="bg-amber-50 border border-amber-100 rounded p-3 mt-2 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">{t('whatsapp.connectionNeeded', 'Conexão necessária')}</p>
              <p className="mt-1">{t('whatsapp.pleaseConnectNumber', 'Por favor, insira seu número de WhatsApp para conectar ao sistema.')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
