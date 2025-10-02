
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Configuração para CORS
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
    // Obter variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obter o número de telefone do corpo da requisição
    const { phoneNumber, userId } = await req.json();
    
    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Número de telefone não fornecido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Verificar se o número já está em uso por outro usuário
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('whatsapp_number', phoneNumber)
      .neq('id', userId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    // Retornar resultado da verificação
    return new Response(
      JSON.stringify({ 
        exists: data !== null,
        message: data !== null ? 'Número já em uso por outro usuário' : 'Número disponível'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Erro ao verificar número de WhatsApp:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Erro ao verificar número de WhatsApp',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
