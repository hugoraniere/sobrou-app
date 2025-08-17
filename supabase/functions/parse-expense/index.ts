
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from './cors.ts';
import { aiParseTransaction } from './aiParser.ts';
import { parseExpenseText } from './keywordParser.ts';
import { normalizeTransactionType } from './typeNormalizer.ts';

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
        category: transaction.category || 'other'
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
    parsed.category = parsed.category || 'other';
    
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
