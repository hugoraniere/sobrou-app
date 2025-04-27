
import { corsHeaders } from './cors.ts';

export async function aiParseTransaction(text: string) {
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
              - If category is unclear, use "compras" as default
              
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
    const parsed = JSON.parse(parsedResult);
    
    // Garantir que sempre temos uma categoria válida
    if (!parsed.category) {
      parsed.category = 'compras';
    }
    
    return parsed;
  } catch (error) {
    console.error("AI parsing error:", error);
    // Retornar um objeto com valores padrão em caso de erro
    return {
      amount: 0,
      type: 'expense',
      category: 'compras',
      description: text,
      isSaving: false,
      savingGoal: null
    };
  }
}
