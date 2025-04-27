
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
