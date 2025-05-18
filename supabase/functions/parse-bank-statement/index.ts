
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
  console.log("Requisição recebida pela função parse-bank-statement");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Requisição OPTIONS recebida, retornando headers CORS");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter os dados do corpo da requisição
    console.log("Tentando parsear corpo da requisição");
    
    // Log raw request to help debug
    const bodyText = await req.text();
    console.log("Corpo bruto da requisição recebido. Tamanho:", bodyText.length);
    
    if (!bodyText || bodyText.trim() === '') {
      console.error("Erro: Corpo da requisição está vazio");
      return new Response(
        JSON.stringify({ error: "Corpo da requisição está vazio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(bodyText);
      console.log("Corpo da requisição parseado com sucesso");
    } catch (error) {
      console.error("Erro ao parsear JSON da requisição:", error);
      // Tentar recuperar de erro de parsing com um objeto básico
      if (bodyText) {
        requestData = { textContent: bodyText };
        console.log("Recuperado do erro de parsing usando o corpo bruto como textContent");
      } else {
        return new Response(
          JSON.stringify({ error: "Formato de requisição inválido: " + error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    console.log("Dados da requisição:", JSON.stringify(requestData).substring(0, 200) + "...");
    
    const { textContent } = requestData;
    
    if (!textContent) {
      console.error("Erro: Conteúdo do extrato não fornecido");
      return new Response(
        JSON.stringify({ error: "Conteúdo do extrato é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof textContent !== 'string') {
      console.error("Erro: textContent não é uma string:", typeof textContent);
      // Tentativa de convertê-lo para string
      const convertedContent = String(textContent);
      if (convertedContent) {
        console.log("Conseguimos converter para string, prosseguindo");
        // Continue com a string convertida
        return processExtractContent(convertedContent, corsHeaders);
      } else {
        return new Response(
          JSON.stringify({ error: "O conteúdo do extrato deve ser uma string" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (textContent.trim() === '') {
      console.error("Erro: textContent está vazio após trim");
      return new Response(
        JSON.stringify({ error: "O conteúdo do extrato não pode estar vazio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prosseguir com o processamento do conteúdo
    return await processExtractContent(textContent, corsHeaders);

  } catch (error) {
    console.error("Erro ao analisar extrato:", error);
    
    // Garantir que todos os erros retornem com os cabeçalhos CORS
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao processar extrato bancário" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Função separada para processar o conteúdo do extrato
async function processExtractContent(textContent: string, corsHeaders: Record<string, string>) {
  try {
    console.log("Processando conteúdo do extrato bancário...");
    console.log("Tamanho do conteúdo:", textContent.length);
    console.log("Amostra do conteúdo:", textContent.substring(0, 100) + "...");
    
    // Verificação adicional para garantir conteúdo mínimo
    if (textContent.length < 20) {
      console.warn("Conteúdo muito curto, pode não ser um extrato válido");
      // Continuar mesmo assim, a IA pode conseguir extrair algo
    }
    
    // Chamar a API da OpenAI para extrair as transações
    const transactions = await extractTransactionsWithAI(textContent);
    
    console.log("Transações extraídas com sucesso:", transactions.length);
    
    return new Response(
      JSON.stringify({ transactions }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao processar conteúdo:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao processar conteúdo do extrato" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function extractTransactionsWithAI(textContent: string): Promise<ExtractedTransaction[]> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error("API key do OpenAI não configurada");
      throw new Error('API key do OpenAI não configurada');
    }
    
    console.log("Validando conteúdo antes de enviar para OpenAI...");
    if (!textContent || typeof textContent !== 'string') {
      throw new Error('Conteúdo do extrato inválido ou vazio');
    }
    
    // Limitar o tamanho do texto para evitar exceder limites de tokens mas ser menos agressivo
    const maxLength = 20000; // Aumentado para 20K caracteres
    const trimmedContent = textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + "..." 
      : textContent;
    
    // Detectar informações importantes no texto como o ano do documento
    let extractedYear: number | null = null;
    
    // Buscar o ano no texto usando padrões comuns
    const dueDatePattern = /venc[a-zíê]*:?\s+\d{1,2}\/\d{1,2}\/(\d{4})/i;
    const dueDateMatch = textContent.match(dueDatePattern);
    if (dueDateMatch && dueDateMatch[1]) {
      extractedYear = parseInt(dueDateMatch[1], 10);
      console.log(`Ano extraído de data de vencimento: ${extractedYear}`);
    }
    
    if (!extractedYear) {
      // Tentar encontrar o ano no começo do documento
      const anyFullDatePattern = /\d{1,2}\/\d{1,2}\/(\d{4})/;
      const anyFullDateMatch = textContent.substring(0, 500).match(anyFullDatePattern);
      if (anyFullDateMatch && anyFullDateMatch[1]) {
        extractedYear = parseInt(anyFullDateMatch[1], 10);
        console.log(`Ano extraído de data completa no início: ${extractedYear}`);
      }
    }
    
    // Verificar se o ano é válido (entre 2000 e próximo ano)
    const currentYear = new Date().getFullYear();
    if (extractedYear && (extractedYear < 2000 || extractedYear > currentYear + 1)) {
      console.log(`Ano extraído ${extractedYear} fora do intervalo válido, ignorando`);
      extractedYear = null;
    }
    
    // Modelo instrucional otimizado para faturas de cartão de crédito e extratos bancários
    const systemPrompt = `
    Você é um especialista financeiro focado em extrair transações de extratos bancários e faturas de cartão de crédito.
    
    Regras importantes:
    1. Identifique datas no formato brasileiro (dd/mm ou dd/mm/yy ou dd/mm/yyyy)
    2. Valores monetários: R$ XX,XX ou XX.XX ou XX,XX
    3. Classifique como "income" (entrada) ou "expense" (saída/compra)
    4. Use categorias: alimentacao, moradia, transporte, internet, cartao, saude, lazer, compras, investimentos, familia, doacoes
    5. Para faturas de cartão, todas as compras são "expense"
    6. Pagamentos de faturas geralmente são "expense" tipo "cartao"
    7. Normalize as datas para o formato ISO (YYYY-MM-DD)
    
    IMPORTANTE:
    ${extractedYear ? `* O ano do documento é ${extractedYear}. Use este ano para todas as datas que não especificam o ano.` : '* Se uma data não especificar o ano (formato DD/MM), use o ano atual.'}
    * Este é provavelmente uma fatura de cartão de crédito, portanto a maioria dos itens são compras (expenses).
    
    Retorne APENAS um JSON válido com um array de transações. Formato:
    [
      {"date": "2023-05-15", "description": "MERCADO XYZ", "amount": 152.35, "type": "expense", "category": "alimentacao"},
      {"date": "2023-05-10", "description": "PAGAMENTO RECEBIDO", "amount": 3500, "type": "income", "category": "salario"}
    ]`;
    
    console.log("Enviando requisição para OpenAI. Tamanho do conteúdo:", trimmedContent.length);

    // Usamos streaming para melhorar a performance e evitar timeouts
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo mais rápido
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: trimmedContent }
        ],
        temperature: 0.0, // Reduzir a criatividade para extrações mais precisas
        max_tokens: 4000,
        response_format: { type: "json_object" } // Forçar resposta em formato JSON
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resposta de erro da API da OpenAI:", errorData);
      throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    console.log("Resposta da OpenAI recebida. Status:", response.status);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Resposta da OpenAI não contém mensagem:", data);
      throw new Error("Resposta inválida da API OpenAI");
    }
    
    const content = data.choices[0].message.content;
    console.log("Resposta da IA recebida. Tamanho:", content.length);
    console.log("Amostra:", content.substring(0, 200) + "...");
    
    // Extrair JSON da resposta formatada
    const jsonResponse = JSON.parse(content);
    
    // Verificar se temos o campo 'transactions' ou se é um array diretamente
    let extractedTransactions;
    if (Array.isArray(jsonResponse)) {
      extractedTransactions = jsonResponse;
    } else if (jsonResponse.transactions && Array.isArray(jsonResponse.transactions)) {
      extractedTransactions = jsonResponse.transactions;
    } else {
      // Tentar encontrar qualquer array no objeto de resposta
      const possibleArrays = Object.values(jsonResponse).filter(v => Array.isArray(v));
      if (possibleArrays.length > 0 && possibleArrays[0].length > 0) {
        extractedTransactions = possibleArrays[0];
      } else {
        throw new Error("Formato de resposta inválido: não foi possível encontrar um array de transações");
      }
    }
    
    console.log(`Extração bem-sucedida: ${extractedTransactions.length} transações encontradas`);
    return extractedTransactions;
  } catch (error) {
    console.error("Erro detalhado ao extrair transações com IA:", error);
    throw error;
  }
}
