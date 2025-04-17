
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, PhoneCall, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

const WhatsAppIntegration = () => {
  const { isAuthenticated, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [savedPhoneNumber, setSavedPhoneNumber] = useState<string | null>(null);

  // Carregar o número de telefone salvo quando o componente for montado
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Erro ao buscar perfil:', error);
          return;
        }
        
        if (data?.whatsapp_number) {
          setSavedPhoneNumber(data.whatsapp_number);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para conectar o WhatsApp");
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Por favor, insira um número de telefone válido");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Salvar o número no perfil do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ whatsapp_number: phoneNumber })
        .eq('id', user.id);
        
      if (updateError) throw updateError;

      // Enviar mensagem de boas-vindas
      const { error: welcomeError } = await supabase.functions.invoke('send-whatsapp-welcome', {
        body: { phone: phoneNumber }
      });

      if (welcomeError) {
        console.error('Erro ao enviar mensagem de boas-vindas:', welcomeError);
      }
      
      setIsConnected(true);
      setSavedPhoneNumber(phoneNumber);
      toast.success("WhatsApp conectado com sucesso! Você receberá uma mensagem em breve.");
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      toast.error("Falha ao conectar WhatsApp. Por favor, tente novamente.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ whatsapp_number: null })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      setIsConnected(false);
      setSavedPhoneNumber(null);
      setPhoneNumber('');
      toast.success("WhatsApp desconectado com sucesso!");
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      toast.error("Falha ao desconectar WhatsApp. Por favor, tente novamente.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Conecte seu WhatsApp</h1>
            <p className="text-gray-600">Vincule seu WhatsApp para começar a registrar despesas automaticamente</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conexão com WhatsApp</CardTitle>
              <CardDescription>
                {isConnected 
                  ? `Seu WhatsApp está conectado com o número: ${savedPhoneNumber}`
                  : "Insira seu número de telefone para receber uma mensagem de verificação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <form onSubmit={handleConnect} className="space-y-4">
                  <div>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md">
                        <PhoneCall className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        type="tel"
                        placeholder="Seu número de WhatsApp"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Inclua o código do país (ex: +55 para Brasil)
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={isConnecting} className="w-full">
                    {isConnecting ? "Conectando..." : "Conectar WhatsApp"}
                  </Button>
                </form>
              ) : (
                <div className="py-4">
                  <div className="flex items-center space-x-2 text-green-600 mb-4">
                    <Check className="h-6 w-6" />
                    <span className="font-medium">WhatsApp Conectado com Sucesso!</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Seu WhatsApp está vinculado ao Sobrou. Você já pode começar a enviar suas
                    despesas diretamente.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/" className="flex-1">
                      <Button className="w-full">
                        Ir para o Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleDisconnect}
                    >
                      Desconectar WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Como funciona</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Envie mensagens com suas despesas</h3>
                  <p className="text-gray-600">
                    Simplesmente envie mensagens como "Gastei R$25 no jantar" ou "Uber R$12"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">IA categoriza despesas automaticamente</h3>
                  <p className="text-gray-600">
                    Extraímos o valor, categoria e descrição da sua mensagem
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Veja seu painel financeiro</h3>
                  <p className="text-gray-600">
                    Acompanhe seus padrões de gastos, receba insights e sugestões de economia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Exemplos de mensagens</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>"Gastei R$45,50 em compras no Mercado"</li>
                    <li>"R$12 almoço hoje"</li>
                    <li>"Pagamento aluguel R$1200"</li>
                    <li>"Corrida de Uber ontem R$18,75"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppIntegration;
