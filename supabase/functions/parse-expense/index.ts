
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from './cors.ts';
import { aiParseTransaction } from './aiParser.ts';
import { parseExpenseText } from './keywordParser.ts';

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
      // If it's an array, validate each transaction
      if (Array.isArray(aiResult)) {
        const validTransactions = aiResult.filter(transaction => 
          transaction && transaction.amount && !isNaN(transaction.amount)
        );
        
        if (validTransactions.length > 0) {
          console.log(`Returning ${validTransactions.length} valid transactions from AI`);
          return new Response(
            JSON.stringify(validTransactions),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } 
      // If it's a single transaction, validate it
      else if (aiResult.amount && !isNaN(aiResult.amount)) {
        console.log("Returning single valid transaction from AI");
        return new Response(
          JSON.stringify(aiResult),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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
