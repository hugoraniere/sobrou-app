
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, userId, transactions } = await req.json()
    
    console.log("Received prompt:", prompt);
    console.log("User ID:", userId);
    console.log("Transactions count:", transactions ? transactions.length : 0);
    
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
            content: `Você é um assistente financeiro no app Sobrou. Sempre responda com linguagem clara, objetiva e fácil de ler em dispositivos móveis.

NÃO utilize formatação Markdown.
NÃO utilize símbolos como asteriscos, ###, -, bullets ou listas numeradas.

Organize o conteúdo com parágrafos bem separados.
Use espaçamento natural entre os blocos de texto.
Destaque valores, categorias e análises com frases diretas, não com negrito artificial.

SEMPRE use duas casas decimais ao apresentar valores monetários, no formato R$ X,XX.

Sempre processe todos os valores listados em transações, sem omitir nenhuma linha, mesmo que nomes de categorias ou descrições se repitam.

Some com exatidão os valores de receita e despesa e calcule o saldo como: receita total - despesa total.
Verifique cuidadosamente o tipo de cada transação antes de somar (income para receitas, expense para despesas).

Nunca baseie a análise em somas parciais.
Se o saldo estiver negativo, oriente o usuário com sugestões práticas para reorganizar seus gastos.
Evite conclusões neutras ou positivas sem considerar o resultado numérico real.

Aqui estão as transações recentes do usuário: ${JSON.stringify(transactions || [])}
Use estes dados para fornecer análises detalhadas e insights personalizados.
Seja específico ao mencionar valores, categorias e padrões de gastos.
Mantenha as respostas concisas e diretas.`
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
    
    if (data.error) {
      throw new Error(`OpenAI Error: ${data.error.message || 'Unknown error'}`);
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Formato de resposta inválido da OpenAI');
    }
    
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
