
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BugIcon } from 'lucide-react';
import { toast } from 'sonner';

const DebugCard = () => {
  const [verifyToken, setVerifyToken] = useState('sobrou_webhook_token');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestWebhook = async () => {
    try {
      setIsLoading(true);
      setTestResponse(null);

      // Construir URL de teste que simula a verificação do WhatsApp
      const testUrl = `https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/whatsapp-test?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(verifyToken)}&hub.challenge=CHALLENGE_ACCEPTED`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.text();
      setTestResponse(data);

      if (response.ok && data === 'CHALLENGE_ACCEPTED') {
        toast.success('Verificação do webhook bem-sucedida!');
      } else {
        toast.error('Falha na verificação do webhook');
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      setTestResponse(error.toString());
      toast.error('Erro ao testar webhook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BugIcon className="h-5 w-5 mr-2" />
          Depuração do Webhook
        </CardTitle>
        <CardDescription>
          Ferramentas para diagnosticar problemas de configuração do webhook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Token de verificação</h3>
          <Input 
            value={verifyToken} 
            onChange={(e) => setVerifyToken(e.target.value)}
            placeholder="Token de verificação"
          />
          <p className="text-sm text-muted-foreground">
            Este token deve corresponder ao token configurado no Portal de Desenvolvedores do Meta
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">URL do Webhook</h3>
          <Input 
            value={webhookUrl} 
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="URL do Webhook (exemplo: https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/whatsapp-webhook)"
          />
          <p className="text-sm text-muted-foreground">
            URL configurada no Portal de Desenvolvedores do Meta
          </p>
        </div>

        <Button 
          onClick={handleTestWebhook} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testando...' : 'Testar Webhook'}
        </Button>

        {testResponse && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="font-medium">Resposta do teste:</h3>
              <pre className="bg-slate-100 p-3 rounded-md text-sm overflow-auto max-h-40">
                {testResponse}
              </pre>
            </div>
          </>
        )}

        <Separator className="my-4" />

        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
          <h3 className="text-blue-800 font-medium mb-2">Dicas de configuração:</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li>Verifique se o token no Meta Developer Portal corresponde ao WHATSAPP_VERIFY_TOKEN em Supabase</li>
            <li>Certifique-se que a URL do webhook está correta: https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/whatsapp-webhook</li>
            <li>Verifique se a função está publicada e acessível</li>
            <li>Confirme que o WHATSAPP_ACCESS_TOKEN está configurado corretamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugCard;
