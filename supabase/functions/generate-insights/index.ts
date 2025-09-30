
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
    const { transactions } = await req.json()
    
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Nenhuma transação fornecida ou formato inválido',
          insights: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`Processando ${transactions.length} transações para insights`)

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      console.error('Erro: Chave da API OpenAI ausente')
      throw new Error('Chave da API OpenAI ausente')
    }

    // Calcular métricas financeiras básicas para contexto
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = totalIncome - totalExpense
    
    // Agrupar transações por categoria para análise de despesas
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
    
    // Ordenar categorias por valor gasto
    const topCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    // Formatar dados de transação para OpenAI
    const transactionSummary = {
      totalExpense,
      totalIncome,
      balance,
      transactionCount: transactions.length,
      topCategories,
      recentTransactions: transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
    }

    // Chamar OpenAI para gerar insights
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um analista financeiro IA que fornece insights personalizados baseados em dados de transações.
            Gere de 3 a 5 insights específicos e acionáveis a partir dos dados de transações do usuário.
            Cada insight deve ser categorizado como um dos seguintes: "warning" (aviso), "opportunity" (oportunidade), "pattern" (padrão), "suggestion" (sugestão) ou "achievement" (conquista).
            
            Formate a resposta como um array JSON de objetos com a seguinte estrutura:
            [{
              "title": "Título breve e chamativo",
              "description": "Explicação detalhada com valores específicos e percentuais quando relevante",
              "category": "warning|opportunity|pattern|suggestion|achievement",
              "priority": 1-5 (1 sendo a maior prioridade)
            }]
            
            Foque em:
            1. Padrões de gastos incomuns
            2. Oportunidades de orçamento
            3. Recomendações de economia
            4. Relação receita/despesa
            5. Insights específicos por categoria
            
            IMPORTANTE: Todas as respostas DEVEM ser em português brasileiro.
            Seja muito específico com números e conselhos acionáveis. Use os dados reais das transações.`
          },
          {
            role: 'user',
            content: JSON.stringify(transactionSummary)
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('Erro na API OpenAI:', data.error)
      throw new Error(`Erro na API OpenAI: ${data.error.message || 'Erro desconhecido'}`)
    }
    
    console.log('Insights gerados com sucesso')
    
    let insights = []
    try {
      const content = data.choices[0].message.content
      insights = JSON.parse(content).insights || []
    } catch (error) {
      console.error('Erro ao analisar resposta da OpenAI:', error)
      throw new Error('Erro ao analisar resposta da OpenAI')
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao gerar insights:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro desconhecido', 
        insights: [] 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
