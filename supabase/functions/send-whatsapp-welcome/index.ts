
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Número de telefone não fornecido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Aqui você chamaria sua API de WhatsApp para enviar a mensagem
    // Por exemplo, usando a API do WhatsApp Business
    const message = `Olá! Bem-vindo ao Sobrou! 🎉\n\nAgora você pode registrar suas despesas diretamente pelo WhatsApp. Experimente enviando uma mensagem como:\n\n"Gastei R$50 no mercado"\n"Paguei R$12 no almoço"\n\nSuas transações serão registradas automaticamente! 📱💰`;

    // Simula o envio da mensagem (substitua com sua implementação real)
    console.log(`Enviando mensagem para ${phone}: ${message}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Mensagem de boas-vindas enviada' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
