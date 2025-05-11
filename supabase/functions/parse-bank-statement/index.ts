
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
    const requestData = await req.json().catch(error => {
      console.error("Erro ao parsear JSON da requisição:", error);
      throw new Error("Formato de requisição inválido: " + error.message);
    });
    
    const { textContent } = requestData;
    
    if (!textContent) {
      console.error("Erro: Conteúdo do extrato não fornecido");
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
      console.error("API key do OpenAI não configurada");
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
    
    console.log("Enviando requisição para a OpenAI...");
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
    }).catch(error => {
      console.error("Erro na requisição para OpenAI:", error);
      throw new Error(`Falha na comunicação com a API OpenAI: ${error.message}`);
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resposta de erro da API da OpenAI:", errorData);
      throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("Resposta da IA recebida:", content.substring(0, 100) + "...");
    
    // Melhorando a extração do JSON com múltiplos métodos
    return extractJSONFromContent(content);
  } catch (error) {
    console.error("Erro detalhado ao extrair transações com IA:", error);
    throw error;
  }
}

function extractJSONFromContent(content: string): ExtractedTransaction[] {
  console.log("Iniciando extração de JSON da resposta");
  
  // Método 1: Tentar fazer parse diretamente do conteúdo
  try {
    console.log("Método 1: Parse direto");
    return JSON.parse(content) as ExtractedTransaction[];
  } catch (directParseError) {
    console.log("Parse direto falhou, tentando métodos alternativos");
  }
  
  // Método 2: Tentar extrair JSON com regex mais robusta
  try {
    console.log("Método 2: Extração com regex");
    // Regex melhorada para encontrar arrays JSON válidos
    const jsonRegex = /\[\s*\{[\s\S]*?\}\s*\]/g;
    const jsonMatch = content.match(jsonRegex);
    
    if (jsonMatch && jsonMatch.length > 0) {
      console.log("JSON encontrado com regex:", jsonMatch[0].substring(0, 50) + "...");
      return JSON.parse(jsonMatch[0]) as ExtractedTransaction[];
    }
  } catch (regexError) {
    console.log("Extração com regex falhou:", regexError);
  }
  
  // Método 3: Limpar markdown e backticks
  try {
    console.log("Método 3: Limpeza de markdown");
    const cleanContent = content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    
    if (cleanContent.startsWith('[') && cleanContent.endsWith(']')) {
      console.log("JSON encontrado após limpeza de markdown");
      return JSON.parse(cleanContent) as ExtractedTransaction[];
    }
  } catch (cleanupError) {
    console.log("Limpeza de markdown falhou:", cleanupError);
  }
  
  // Método 4: Tentar encontrar qualquer estrutura que pareça um array JSON
  try {
    console.log("Método 4: Busca por estrutura de array");
    const arrayStart = content.indexOf('[');
    const arrayEnd = content.lastIndexOf(']');
    
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayStart < arrayEnd) {
      const possibleJson = content.substring(arrayStart, arrayEnd + 1);
      console.log("Possível JSON encontrado:", possibleJson.substring(0, 50) + "...");
      return JSON.parse(possibleJson) as ExtractedTransaction[];
    }
  } catch (structureError) {
    console.log("Busca por estrutura de array falhou:", structureError);
  }
  
  // Se nada funcionar, retornar array vazio e logar o conteúdo para debug
  console.error("Todos os métodos de extração de JSON falharam");
  console.error("Conteúdo que falhou ao parsear:", content);
  throw new Error("Formato de resposta da IA inválido: não foi possível extrair um JSON válido");
}
