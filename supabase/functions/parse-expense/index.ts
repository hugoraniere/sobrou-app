
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from './cors.ts';
import { aiParseTransaction } from './aiParser.ts';
import { parseExpenseText } from './keywordParser.ts';
import { normalizeTransactionType } from './typeNormalizer.ts';

// Category normalization mapping for AI-returned categories
const CATEGORY_NORMALIZATION: Record<string, string> = {
  // AI common returns to valid categories
  'academia': 'saude',
  'gym': 'saude',
  'fitness': 'saude',
  'exercício': 'saude',
  'exercicio': 'saude',
  'treino': 'saude',
  'musculação': 'saude',
  'musculacao': 'saude',
  
  // Streaming and subscriptions
  'netflix': 'internet',
  'spotify': 'internet',
  'amazon prime': 'internet',
  'prime video': 'internet',
  'disney': 'internet',
  'hbo': 'internet',
  'globoplay': 'internet',
  'youtube premium': 'internet',
  'assinatura': 'internet',
  'subscription': 'internet',
  
  // Shopping platforms
  'amazon': 'compras',
  'mercado livre': 'compras',
  'mercadolivre': 'compras',
  'aliexpress': 'compras',
  'shopee': 'compras',
  'shein': 'compras',
  'magazine luiza': 'compras',
  'americanas': 'compras',
  'casas bahia': 'compras',
  'shopping': 'compras',
  
  // Health
  'hospital': 'saude',
  'farmacia': 'saude',
  'farmácia': 'saude',
  'médico': 'saude',
  'medico': 'saude',
  'consulta': 'saude',
  'exame': 'saude',
  'dentista': 'saude',
  'clínica': 'saude',
  'clinica': 'saude',
  
  // Food
  'restaurante': 'alimentacao',
  'mercado': 'alimentacao',
  'supermercado': 'alimentacao',
  'ifood': 'alimentacao',
  'delivery': 'alimentacao',
  'padaria': 'alimentacao',
  'lanchonete': 'alimentacao',
  
  // Transport
  'uber': 'transporte',
  'taxi': 'transporte',
  '99': 'transporte',
  'gasolina': 'transporte',
  'combustível': 'transporte',
  'combustivel': 'transporte',
  
  // Other normalizations
  'outros': 'other',
  'outros gastos': 'other',
  'diverso': 'other',
  'various': 'other',
  'miscellaneous': 'other'
};

function normalizeCategory(category: string): string {
  if (!category) return 'other';
  
  const lowerCategory = category.toLowerCase();
  
  // Direct mapping from normalization table
  if (CATEGORY_NORMALIZATION[lowerCategory]) {
    return CATEGORY_NORMALIZATION[lowerCategory];
  }
  
  // Check if it's already a valid category ID
  const validCategories = [
    'alimentacao', 'moradia', 'transporte', 'internet', 'cartao',
    'saude', 'lazer', 'compras', 'investimentos', 'familia', 'doacoes', 'other'
  ];
  
  if (validCategories.includes(lowerCategory)) {
    return lowerCategory;
  }
  
  // Default to 'other' for unrecognized categories
  return 'other';
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

    // Check if AI parsing succeeded (can be single transaction or array)
    if (aiResult) {
      console.log("Using AI parsing result");
      
      // Handle both single transaction and array of transactions
      const transactions = Array.isArray(aiResult) ? aiResult : [aiResult];
      
      const processedTransactions = transactions.map(transaction => ({
        ...transaction,
        type: normalizeTransactionType(text, transaction.type),
        category: normalizeCategory(transaction.category)
      }));
      
      console.log("Final AI result:", processedTransactions);
      
      return new Response(
        JSON.stringify(processedTransactions.length === 1 ? processedTransactions[0] : processedTransactions),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback to rule-based parsing
    console.log("Falling back to rule-based parsing");
    const parsed = parseExpenseText(text);
    
    // Apply type normalization to fallback result too
    parsed.type = normalizeTransactionType(text, parsed.type);
    parsed.category = normalizeCategory(parsed.category);
    
    console.log("Final fallback result:", parsed);
    
    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in parse-expense function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
