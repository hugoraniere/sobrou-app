
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
    // English
    "received", "earned", "salary", "income", "payment", "paid me", "freelance", "bonus",
    // Portuguese
    "recebi", "ganhei", "salário", "salario", "pagamento", "me pagou", "freelancer", "bônus", "bonus", "pix"
  ];
  
  const savingKeywords = [
    // English
    "saved", "saving", "savings", "put aside", "fund", "goal",
    // Portuguese
    "economizei", "poupei", "guardar", "guardei", "poupança", "poupanca", "reserva"
  ];
  
  const recurringKeywords = [
    // English
    "monthly", "weekly", "recurring", "every month", "subscription", "bill",
    // Portuguese
    "mensal", "semanal", "recorrente", "todo mês", "todo mes", "assinatura", "conta"
  ];
  
  let type = "expense"; // default
  let isSaving = false;
  let isRecurring = false;
  let recurrenceInterval = null;
  
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
  
  for (const keyword of recurringKeywords) {
    if (text.includes(keyword)) {
      isRecurring = true;
      if (text.includes("weekly") || text.includes("semanal")) {
        recurrenceInterval = "weekly";
      } else if (text.includes("monthly") || text.includes("mensal")) {
        recurrenceInterval = "monthly";
      } else if (text.includes("yearly") || text.includes("annual") || text.includes("anual")) {
        recurrenceInterval = "yearly";
      } else {
        recurrenceInterval = "monthly"; // default
      }
      break;
    }
  }
  
  // Extract date
  const today = new Date();
  let date = today.toISOString().split('T')[0];
  
  if (text.includes("yesterday") || text.includes("ontem")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  } else if (text.includes("last week") || text.includes("semana passada")) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    date = lastWeek.toISOString().split('T')[0];
  } else if (text.includes("last month") || text.includes("mês passado") || text.includes("mes passado")) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    date = lastMonth.toISOString().split('T')[0];
  }
  
  // Determine category
  let category = "Other";
  
  const categoryMapping: Record<string, string[]> = {
    "Food": [
      // English
      "food", "grocery", "groceries", "restaurant", "lunch", "dinner", "breakfast", "meal", "snack", "coffee",
      // Portuguese
      "comida", "mercado", "restaurante", "almoço", "almoco", "jantar", "café da manhã", "cafe da manha", "lanche", "café", "cafe"
    ],
    "Transportation": [
      // English
      "transport", "uber", "lyft", "taxi", "bus", "train", "gas", "fuel", "car", "ride",
      // Portuguese
      "transporte", "táxi", "taxi", "ônibus", "onibus", "trem", "metrô", "metro", "gasolina", "combustível", "combustivel", "carro", "corrida"
    ],
    "Housing": [
      // English
      "rent", "mortgage", "apartment", "house", "housing",
      // Portuguese
      "aluguel", "hipoteca", "apartamento", "casa", "moradia", "condomínio", "condominio"
    ],
    "Entertainment": [
      // English
      "movie", "game", "entertainment", "concert", "theatre", "theater", "show",
      // Portuguese
      "filme", "cinema", "jogo", "entretenimento", "concerto", "teatro", "show"
    ],
    "Shopping": [
      // English
      "clothes", "clothing", "shop", "shopping", "mall", "store", "amazon",
      // Portuguese
      "roupa", "roupas", "compra", "compras", "shopping", "loja", "lojinha"
    ],
    "Utilities": [
      // English
      "electricity", "water", "bill", "utility", "utilities", "internet", "phone", "subscription",
      // Portuguese
      "eletricidade", "água", "agua", "conta", "utilidade", "utilidades", "internet", "telefone", "celular", "assinatura"
    ],
    "Health": [
      // English
      "doctor", "medical", "medicine", "health", "healthcare", "hospital", "therapy",
      // Portuguese
      "médico", "medico", "remédio", "remedio", "saúde", "saude", "hospital", "terapia", "farmácia", "farmacia"
    ],
    "Education": [
      // English
      "book", "course", "class", "tuition", "education", "school", "college", "university",
      // Portuguese
      "livro", "curso", "aula", "mensalidade", "educação", "educacao", "escola", "faculdade", "universidade"
    ],
    "Income": [
      // English
      "salary", "wage", "payment", "income", "freelance", "contract", "bonus", "received",
      // Portuguese
      "salário", "salario", "pagamento", "renda", "freelancer", "contrato", "bônus", "bonus", "recebi"
    ],
    "Savings": [
      // English
      "saving", "saved", "fund", "emergency",
      // Portuguese
      "poupança", "poupanca", "economizei", "fundo", "emergência", "emergencia"
    ]
  };
  
  for (const [cat, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        category = cat;
        break;
      }
    }
    if (category !== "Other") break;
  }
  
  // If it's an income, force category to be Income
  if (type === "income") {
    category = "Income";
  }
  
  // Extract saving goal name if it's a saving
  let savingGoal = null;
  if (isSaving) {
    // Try to find phrases like "for vacation" or "para férias"
    const savingWords = ["for", "to", "in", "into", "para", "em"];
    for (const word of savingWords) {
      const regex = new RegExp(`${word} ([\\w\\s]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        savingGoal = match[1].trim();
        break;
      }
    }
    
    // Default saving goal if none specified
    if (!savingGoal) {
      savingGoal = "General Savings";
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
