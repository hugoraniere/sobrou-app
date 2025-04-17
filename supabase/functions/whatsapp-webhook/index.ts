
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
    // Processar somente requisições POST
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

    // Verificar se é uma mensagem válida (a estrutura exata dependerá do seu provedor de WhatsApp)
    // Este exemplo assume uma estrutura genérica - você precisará adaptar para o seu provedor específico
    if (!payload.phone || !payload.message) {
      return new Response(
        JSON.stringify({ error: 'Payload inválido: precisa de phone e message' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extrair dados da mensagem
    const { phone, message } = payload;
    const cleanPhone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos

    console.log(`Mensagem recebida de ${cleanPhone}: ${message}`);

    // Encontrar usuário pelo número de telefone
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('whatsapp_number', phone)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      throw profileError;
    }

    // Se nenhum usuário for encontrado com este número
    if (!profiles) {
      console.log(`Nenhum usuário encontrado com o número ${phone}`);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = profiles.id;
    console.log(`Usuário encontrado: ${userId}`);

    // Chama a função parse-expense para interpretar a mensagem
    const parseResponse = await fetch(`${supabaseUrl}/functions/v1/parse-expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ text: message })
    });

    if (!parseResponse.ok) {
      throw new Error(`Falha ao processar mensagem: ${parseResponse.statusText}`);
    }

    const parsedData = await parseResponse.json();
    console.log("Dados processados:", parsedData);

    // Criar a transação no banco de dados
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        amount: parsedData.amount,
        description: parsedData.description,
        category: parsedData.category.toLowerCase(),
        type: parsedData.type,
        date: parsedData.date
      }])
      .select()
      .single();

    if (transactionError) {
      console.error("Erro ao criar transação:", transactionError);
      throw transactionError;
    }

    console.log(`Transação criada com sucesso: ${transaction.id}`);

    // Resposta de sucesso
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
    console.error("Erro no webhook do WhatsApp:", error.message);
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
