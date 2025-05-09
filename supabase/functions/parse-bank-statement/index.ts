
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
    console.log("Tamanho do conteúdo:", textContent.length);
    
    // Chamar a API da OpenAI para extrair as transações
    const transactions = await extractTransactionsWithAI(textContent);
    
    return new Response(
      JSON.stringify({ transactions }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao analisar extrato:", error);
    
    // Garantir que todos os erros retornem com os cabeçalhos CORS
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
    
    // Limitar o tamanho do texto para evitar exceder limites de tokens
    const maxLength = 10000;
    const trimmedContent = textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + "..." 
      : textContent;
    
    // Modelo instrucional mais detalhado e específico
    const systemPrompt = `
    Você é um especialista em extrair transações financeiras de extratos bancários.
    Analise o texto do extrato bancário com atenção aos detalhes e extraia todas as transações encontradas.
    
    Regras importantes:
    1. Identifique padrões de datas no formato brasileiro (dd/mm/yyyy ou dd/mm)
    2. Identifique valores monetários (podem estar no formato: R$ 1.234,56 ou 1.234,56 ou 1234.56)
    3. Converta todos os valores para números sem símbolos (1234.56)
    4. Classifique cada transação como "income" (entrada/crédito) ou "expense" (saída/débito)
    5. Tente inferir a categoria com base na descrição (alimentação, transporte, salário, etc.)
    6. Normalize as datas para o formato ISO (YYYY-MM-DD)
    7. Identifique a descrição de cada transação
    
    Responda APENAS com um array JSON válido de transações. Não inclua explicações ou comentários.
    Exemplo do formato esperado:
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
    ]`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: trimmedContent }
        ],
        temperature: 0.1,
        max_tokens: 4000
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Resposta da API da OpenAI:", data);
      throw new Error(`Erro na API OpenAI: ${data.error?.message || 'Erro desconhecido'}`);
    }
    
    const content = data.choices[0].message.content;
    console.log("Resposta da IA:", content.substring(0, 500) + "...");
    
    try {
      // Uso de regex aprimorado para encontrar arrays JSON
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr) as ExtractedTransaction[];
      }
      
      // Segunda tentativa: tentar remover backticks e markdown se presentes
      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      // Tentar parsear o conteúdo limpo
      return JSON.parse(cleanedContent) as ExtractedTransaction[];
    } catch (parseError) {
      console.error("Erro ao parsear resposta da IA:", parseError);
      console.log("Conteúdo que falhou ao parsear:", content);
      throw new Error("Não foi possível extrair transações do formato retornado pela IA");
    }
  } catch (error) {
    console.error("Erro detalhado ao extrair transações com IA:", error);
    throw error;
  }
}
