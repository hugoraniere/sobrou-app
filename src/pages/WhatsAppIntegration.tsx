import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, QrCode, Smartphone } from 'lucide-react';

const WhatsAppIntegration = () => {
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
      
      // Format phone number to remove any non-numeric characters
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Update user metadata with WhatsApp number
      const { error } = await supabase.auth.updateUser({
        data: { 
          whatsapp_number: formattedNumber 
        }
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

  const handleDisconnectWhatsApp = async () => {
    try {
      setIsConnecting(true);
      
      // Remove WhatsApp number from user metadata
      const { error } = await supabase.auth.updateUser({
        data: { 
          whatsapp_number: null 
        }
      });

      if (error) throw error;
      
      setPhoneNumber('');
      toast.success(t('whatsapp.disconnected', 'WhatsApp desconectado com sucesso!'));
    } catch (error: any) {
      console.error('WhatsApp disconnection error:', error);
      toast.error(error.message || t('whatsapp.errorDisconnection', 'Erro ao desconectar WhatsApp'));
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('whatsapp.integration', 'Integração WhatsApp')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
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
              <label className="text-sm font-medium">
                {t('whatsapp.phoneNumber', 'Número de WhatsApp')}
              </label>
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
            
            <div className="flex space-x-2 pt-2">
              {user?.user_metadata?.whatsapp_number ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleDisconnectWhatsApp}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 
                      t('whatsapp.disconnecting', 'Desconectando...') : 
                      t('whatsapp.disconnect', 'Desconectar')}
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleWhatsAppConnection}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 
                      t('whatsapp.updating', 'Atualizando...') : 
                      t('whatsapp.update', 'Atualizar número')}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleWhatsAppConnection}
                  disabled={isConnecting}
                >
                  {isConnecting ? 
                    t('whatsapp.connecting', 'Conectando...') : 
                    t('whatsapp.connect', 'Conectar WhatsApp')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('whatsapp.howToUse', 'Como usar')}
            </CardTitle>
            <CardDescription>
              {t('whatsapp.howToUseDescription', 'Instruções para registrar transações via WhatsApp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">
                  {t('whatsapp.examples', 'Exemplos de mensagens')}
                </h3>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm font-medium">Gastei R$50 no mercado</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm font-medium">Recebi R$1000 de salário</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm font-medium">Paguei R$120 de internet ontem</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">
                  {t('whatsapp.instructions', 'Instruções')}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{t('whatsapp.step1', 'Conecte seu número de WhatsApp acima')}</li>
                  <li>{t('whatsapp.step2', 'Envie mensagens com suas transações')}</li>
                  <li>{t('whatsapp.step3', 'O sistema identificará automaticamente o tipo, valor e categoria')}</li>
                  <li>{t('whatsapp.step4', 'A transação será registrada em sua conta')}</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {user?.user_metadata?.whatsapp_number && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              {t('whatsapp.status', 'Status da Conexão')}
            </CardTitle>
            <CardDescription>
              {t('whatsapp.statusDescription', 'Informações sobre sua conexão atual com WhatsApp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <p className="font-medium text-green-800">
                  {t('whatsapp.connected', 'Conectado')}
                </p>
              </div>
              <p className="mt-2 text-sm text-green-700">
                {t('whatsapp.connectedNumber', 'Número conectado')}: 
                <span className="font-medium ml-1">{user.user_metadata.whatsapp_number}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppIntegration;
