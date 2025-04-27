
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Configuração para acesso ao Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com requisições preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar token de verificação do webhook Meta (para a verificação inicial)
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Verificação do webhook do Meta/WhatsApp
    if (req.method === 'GET' && mode === 'subscribe') {
      // Verificar o token (deve ser configurado no painel do Meta)
      const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'sobrou_webhook_token';
      
      console.log('Recebida solicitação de verificação do webhook:', { mode, token, challenge });
      
      if (token === VERIFY_TOKEN) {
        console.log('Verificação de webhook bem-sucedida');
        return new Response(challenge, { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
        });
      } else {
        console.error('Falha na verificação: token inválido');
        return new Response(JSON.stringify({ error: 'Token de verificação inválido' }), { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // Processar somente requisições POST para mensagens
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar cliente Supabase com chave de serviço para bypass do RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obter dados da requisição
    const payload = await req.json();
    console.log("Payload recebido:", JSON.stringify(payload, null, 2));

    // Processar payload do webhook do WhatsApp Business API
    if (!payload.object || payload.object !== 'whatsapp_business_account') {
      return new Response(
        JSON.stringify({ error: 'Payload inválido: não é uma mensagem do WhatsApp Business' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Processar apenas se for uma mensagem de texto
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      console.log("Recebido evento que não é uma mensagem");
      // Alguns eventos são notificações de status, devemos responder com 200 mesmo assim
      return new Response(
        JSON.stringify({ status: 'success', message: 'Evento processado' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obter a primeira mensagem (geralmente só há uma)
    const message = messages[0];
    
    // Verificar se é uma mensagem de texto
    if (message.type !== 'text') {
      console.log(`Tipo de mensagem não suportado: ${message.type}`);
      return new Response(
        JSON.stringify({ status: 'success', message: 'Tipo de mensagem não processado' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extrair dados da mensagem
    const text = message.text.body;
    const from = message.from; // Número de telefone do remetente
    
    console.log(`Mensagem recebida de ${from}: ${text}`);

    // Normalizar o número de telefone para facilitar a busca
    // Esta função remove caracteres não numéricos e considera vários formatos possíveis
    const normalizePhoneNumber = (phone: string): string => {
      // Remover todos os caracteres não numéricos
      return phone.replace(/\D/g, '');
    };
    
    // Normalizar o número recebido
    const normalizedFrom = normalizePhoneNumber(from);
    
    // Buscar usuário de várias maneiras possíveis
    let userId: string | null = null;
    
    // Primeiro, buscar pela correspondência exata
    const { data: exactProfiles, error: exactError } = await supabase
      .from('profiles')
      .select('id')
      .eq('whatsapp_number', from)
      .maybeSingle();
      
    if (exactError) {
      console.error("Erro ao buscar perfil com número exato:", exactError);
    } else if (exactProfiles) {
      userId = exactProfiles.id;
    }
    
    // Se não encontrou com correspondência exata, buscar usando o número normalizado
    if (!userId) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, whatsapp_number');
        
      if (profileError) {
        console.error("Erro ao buscar perfis:", profileError);
        throw profileError;
      }
      
      // Comparar números normalizados
      for (const profile of profiles || []) {
        if (profile.whatsapp_number && normalizePhoneNumber(profile.whatsapp_number) === normalizedFrom) {
          userId = profile.id;
          break;
        }
      }
    }

    // Se nenhum usuário for encontrado com este número
    if (!userId) {
      console.log(`Nenhum usuário encontrado com o número ${from}`);
      
      // Enviar resposta informando que o número não está registrado
      await sendWhatsAppMessage(from, "Seu número não está registrado no Sobrou. Por favor, registre-se pelo aplicativo.");
      
      return new Response(
        JSON.stringify({ status: 'error', message: 'Usuário não encontrado' }),
        { 
          status: 200, // Respondemos com 200 para o webhook, mas logamos o erro
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Usuário encontrado: ${userId}`);

    // Chama a função parse-expense para interpretar a mensagem
    const parseResponse = await fetch(`${supabaseUrl}/functions/v1/parse-expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ text: text })
    });

    if (!parseResponse.ok) {
      const errorMsg = "Não consegui entender sua mensagem. Por favor, tente novamente com formato como 'Gastei R$50 no mercado'";
      await sendWhatsAppMessage(from, errorMsg);
      throw new Error(`Falha ao processar mensagem: ${parseResponse.statusText}`);
    }

    const parsedData = await parseResponse.json();
    console.log("Dados processados:", parsedData);

    try {
      // Garantir que temos uma categoria válida
      const category = parsedData.category?.toLowerCase() || 'compras';  // Usar 'compras' como categoria padrão
      
      // Criar a transação no banco de dados
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          amount: parsedData.amount,
          description: parsedData.description,
          category: category,
          type: parsedData.type || 'expense', // Garantir um tipo padrão
          date: parsedData.date || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (transactionError) {
        console.error("Erro ao criar transação:", transactionError);
        throw transactionError;
      }

      console.log(`Transação criada com sucesso: ${transaction.id}`);
      
      // Envia confirmação para o usuário com mais detalhes
      const confirmationMsg = `✅ Transação registrada!\n\nValor: R$ ${parsedData.amount}\nCategoria: ${category}\nDescrição: ${parsedData.description}`;
      await sendWhatsAppMessage(from, confirmationMsg);

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Transação registrada com sucesso',
          data: transaction
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error("Erro ao processar transação:", error);
      const errorMsg = "Desculpe, ocorreu um erro ao registrar sua transação. Por favor, tente novamente com o formato: 'Gastei R$50 no mercado'";
      await sendWhatsAppMessage(from, errorMsg);
      throw error;
    }

  } catch (error) {
    console.error("Erro no webhook do WhatsApp:", error.message);
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { 
        status: 200, // Sempre responder com 200 para webhooks, mesmo em erro
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Função para enviar mensagem usando a API oficial do WhatsApp Business
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    // Obter configurações do WhatsApp Business
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || '704756652109046';
    const ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    
    if (!ACCESS_TOKEN) {
      throw new Error("Token de acesso do WhatsApp não configurado");
    }

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro ao enviar mensagem WhatsApp:", errorData);
      throw new Error(`Falha ao enviar mensagem WhatsApp: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Mensagem WhatsApp enviada com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    throw error;
  }
}
