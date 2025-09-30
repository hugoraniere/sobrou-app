
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Log de todas as informações da requisição para diagnóstico
    const url = new URL(req.url);
    const method = req.method;
    const headers = Object.fromEntries(req.headers.entries());
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const body = req.method !== 'GET' ? await req.text() : null;
    
    const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'sobrou_webhook_token';
    
    // Verificação do webhook do WhatsApp
    if (method === 'GET' && 
        queryParams['hub.mode'] === 'subscribe' && 
        queryParams['hub.verify_token'] === verifyToken) {
      
      console.log('WhatsApp webhook verification successful!');
      return new Response(queryParams['hub.challenge'], { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    }

    // Informação de diagnóstico
    const diagnosticInfo = {
      method,
      url: url.toString(),
      path: url.pathname,
      queryParams,
      headers,
      body,
      environmentVars: {
        verifyTokenConfigured: Boolean(Deno.env.get('WHATSAPP_VERIFY_TOKEN')),
        accessTokenConfigured: Boolean(Deno.env.get('WHATSAPP_ACCESS_TOKEN')),
        phoneNumberIdConfigured: Boolean(Deno.env.get('WHATSAPP_PHONE_NUMBER_ID'))
      }
    };

    console.log('Request diagnostic info:', JSON.stringify(diagnosticInfo, null, 2));

    return new Response(JSON.stringify({ 
      message: "Diagnostic endpoint for WhatsApp webhook",
      receivedData: diagnosticInfo
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error("Error in WhatsApp test function:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
