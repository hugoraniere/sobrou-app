
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface para a transação extraída
interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter os dados do corpo da requisição
    const { textContent } = await req.json();
    
    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "Conteúdo do extrato é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processando conteúdo do extrato bancário...");
    
    // Chamar a API da OpenAI para extrair as transações
    const transactions = await extractTransactionsWithAI(textContent);
    
    return new Response(
      JSON.stringify({ transactions }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao analisar extrato:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao processar extrato bancário" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function extractTransactionsWithAI(textContent: string): Promise<ExtractedTransaction[]> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('API key do OpenAI não configurada');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em extrair transações bancárias de extratos. 
            Analise o texto do extrato bancário e extraia informações sobre cada transação.
            
            Para cada transação encontrada, identifique:
            1. Data (no formato YYYY-MM-DD)
            2. Descrição (o que foi a transação)
            3. Valor numérico (apenas o número, sem símbolos)
            4. Tipo (income para entradas/créditos, expense para saídas/débitos)
            5. Categoria (opcional - tente inferir baseado na descrição)
            
            Responda APENAS com um array JSON de transações, sem explicações.
            Exemplo:
            [
              {
                "date": "2023-05-15",
                "description": "COMPRA SUPERMERCADO XYZ",
                "amount": 152.35,
                "type": "expense",
                "category": "alimentacao"
              },
              {
                "date": "2023-05-10",
                "description": "SALÁRIO",
                "amount": 3500,
                "type": "income",
                "category": "salario"
              }
            ]`
          },
          { role: 'user', content: textContent }
        ],
        temperature: 0.1
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erro na API OpenAI: ${data.error?.message || 'Erro desconhecido'}`);
    }
    
    const content = data.choices[0].message.content;
    
    try {
      // Procurar por array JSON na resposta
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr) as ExtractedTransaction[];
      }
      
      // Se não encontrou, tenta parsear a resposta completa
      return JSON.parse(content) as ExtractedTransaction[];
    } catch (parseError) {
      console.error("Erro ao parsear resposta da IA:", parseError);
      throw new Error("Não foi possível extrair transações do formato retornado pela IA");
    }
  } catch (error) {
    console.error("Erro ao extrair transações com IA:", error);
    throw error;
  }
}
