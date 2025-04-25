
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Simple NLP function to parse expense information from user text input
 * Now with support for Portuguese and improved currency handling
 */
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
  try {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    const { text } = await req.json();
    console.log("Received text to parse:", text);
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text input is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const parsedData = parseExpenseText(text);
    
    return new Response(
      JSON.stringify(parsedData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in parse-expense function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
