
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced transaction parsing with AI
async function aiParseTransaction(text: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a financial transaction parser. Extract these fields from the user's message:
              - amount (number, required)
              - type ("expense" or "income")
              - category (must be one of: alimentacao, moradia, transporte, internet, cartao, saude, lazer, compras, investimentos, familia, doacoes)
              - description (string)
              - isSaving (boolean)
              - savingGoal (string or null)
              
              Rules:
              - If amount contains "k" (e.g., "2k"), multiply by 1000
              - For Brazilian currency (R$), extract just the number
              - If amount is unclear or missing, return error
              - Detect saving intentions ("poupar", "guardar", "economizar")
              - Default type to "expense" unless clear income indicators present
              
              Return ONLY a JSON object with these exact fields.`
          },
          { role: "user", content: text }
        ],
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", data);
    
    const parsedResult = data.choices[0].message.content;
    return JSON.parse(parsedResult);
  } catch (error) {
    console.error("AI parsing error:", error);
    return null;
  }
}

// Original keyword-based parsing function
function parseExpenseText(text: string) {
  text = text.toLowerCase();
  console.log("Parsing text:", text);
  
  // Extract amount - now with support for comma as decimal separator (European/Brazilian format)
  // and currency symbols for BRL (R$)
  const amountRegex = /(r\$|\$)?(\d+(?:[.,]\d+)?)/i;
  const amountMatch = text.match(amountRegex);
  let amount = 0;
  
  if (amountMatch) {
    // Replace comma with dot for proper parsing
    amount = parseFloat(amountMatch[2].replace(',', '.'));
  }
  console.log("Extracted amount:", amount);

  // Determine type (expense or income)
  const incomeKeywords = [
    "recebi", "ganhei", "salário", "salario", "pagamento", 
    "me pagou", "freelancer", "bônus", "bonus", "pix"
  ];
  
  const savingKeywords = [
    "economizei", "poupei", "guardar", "guardei", "poupança", 
    "poupanca", "reserva"
  ];
  
  let type = "expense"; // default
  let isSaving = false;
  
  for (const keyword of incomeKeywords) {
    if (text.includes(keyword)) {
      type = "income";
      break;
    }
  }
  
  for (const keyword of savingKeywords) {
    if (text.includes(keyword)) {
      isSaving = true;
      break;
    }
  }
  
  // Extract date
  const today = new Date();
  let date = today.toISOString().split('T')[0];
  
  if (text.includes("ontem")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  } else if (text.includes("semana passada")) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    date = lastWeek.toISOString().split('T')[0];
  } else if (text.includes("mês passado") || text.includes("mes passado")) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    date = lastMonth.toISOString().split('T')[0];
  }
  
  // Determine category using Portuguese keywords
  const categoryMapping: Record<string, string[]> = {
    "alimentacao": [
      "comida", "mercado", "restaurante", "almoço", "almoco", 
      "jantar", "café", "cafe", "lanche", "supermercado"
    ],
    "moradia": [
      "aluguel", "condomínio", "condominio", "luz", "água", "agua", 
      "energia", "gás", "gas", "iptu"
    ],
    "transporte": [
      "uber", "99", "taxi", "ônibus", "onibus", "metrô", "metro", 
      "gasolina", "combustível", "combustivel"
    ],
    "internet": [
      "internet", "wifi", "telefone", "celular", "tim", "vivo", 
      "claro", "oi"
    ],
    "cartao": [
      "cartão", "cartao", "fatura", "crédito", "credito", "nubank", 
      "bradesco", "itaú", "itau"
    ],
    "saude": [
      "médico", "medico", "hospital", "remédio", "remedio", 
      "consulta", "exame", "farmácia", "farmacia"
    ],
    "lazer": [
      "cinema", "show", "teatro", "viagem", "passeio", "bar", 
      "festa", "jogos", "netflix", "spotify"
    ],
    "compras": [
      "roupa", "shopping", "loja", "compra", "presente", 
      "eletrônico", "eletronico"
    ],
    "investimentos": [
      "investimento", "ação", "acao", "bolsa", "tesouro", "cdb", 
      "poupança", "poupanca"
    ],
    "familia": [
      "escola", "creche", "filho", "família", "familia", "criança", 
      "crianca"
    ],
    "doacoes": [
      "doação", "doacao", "caridade", "ajuda", "ong"
    ]
  };

  let category = "compras"; // Default category

  for (const [cat, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        category = cat;
        break;
      }
    }
    if (category !== "compras") break;
  }

  // If it's food-related, default to 'alimentacao'
  if (text.includes("mercado") || text.includes("comida")) {
    category = "alimentacao";
  }
  
  // Extract saving goal name if it's a saving
  let savingGoal = null;
  if (isSaving) {
    const savingWords = ["para", "em"];
    for (const word of savingWords) {
      const regex = new RegExp(`${word} ([\\w\\s]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        savingGoal = match[1].trim();
        break;
      }
    }
    
    if (!savingGoal) {
      savingGoal = "Poupança Geral";
    }
  }
  
  // Generate a description
  let description = text;
  if (description.length > 50) {
    description = description.substring(0, 47) + "...";
  }
  
  const result = {
    amount,
    type,
    category,
    date,
    description,
    isSaving,
    savingGoal
  };
  
  console.log("Parsed result:", result);
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    console.log("Received text to parse:", text);

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text input is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try AI parsing first
    const aiResult = await aiParseTransaction(text);
    console.log("AI parsing result:", aiResult);

    // If AI parsing succeeds and has valid amount, use it
    if (aiResult && aiResult.amount && !isNaN(aiResult.amount)) {
      return new Response(
        JSON.stringify(aiResult),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback to original parsing if AI fails
    console.log("Falling back to rule-based parsing");
    const parsedData = parseExpenseText(text);
    
    return new Response(
      JSON.stringify(parsedData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in parse-expense function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
