
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, userId } = await req.json()
    
    // Criar cliente Supabase
    const supabaseClient = createClient(
      'https://jevsazpwfowhmjupuuzw.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldnNhenB3Zm93aG1qdXB1dXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjcsImV4cCI6MjA1OTM0NDkyN30.ZvIahA6EAPrVKSEUoRXDFJn6LeyqF-7_QM-Qv5O8Pn8'
    )

    // Buscar dados do usuário
    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    // Processar com OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente financeiro que tem acesso às transações do usuário.
            Aqui estão as últimas transações: ${JSON.stringify(transactions)}
            Responda perguntas sobre gastos, análise financeira e forneça insights úteis.
            Seja conciso e direto nas respostas.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
