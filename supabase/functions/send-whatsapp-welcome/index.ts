
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

    // Obter configurações do WhatsApp Business
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || '704756652109046';
    const ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    
    if (!ACCESS_TOKEN) {
      throw new Error("Token de acesso do WhatsApp não configurado");
    }

    // Mensagem de boas-vindas
    const message = `Olá! Bem-vindo ao Sobrou! 🎉\n\nAgora você pode registrar suas despesas diretamente pelo WhatsApp. Experimente enviando uma mensagem como:\n\n"Gastei R$50 no mercado"\n"Paguei R$12 no almoço"\n\nSuas transações serão registradas automaticamente! 📱💰`;

    // Enviar mensagem usando a API oficial do WhatsApp
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    
    console.log(`Enviando mensagem para ${phone} usando WABA`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
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

    return new Response(
      JSON.stringify({ success: true, message: 'Mensagem de boas-vindas enviada', data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
