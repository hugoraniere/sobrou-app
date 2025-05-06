
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
            content: `Você é um analista financeiro especializado em categorizar transações. Sua tarefa é extrair detalhes de uma transação financeira descrita em texto e categorizá-la corretamente.

              Extraia os seguintes campos:
              - amount (número, obrigatório)
              - type ("expense" para despesas ou "income" para receitas)
              - category (deve ser uma destas categorias exatas: alimentacao, moradia, transporte, internet, cartao, saude, lazer, compras, investimentos, familia, doacoes)
              - description (texto breve)
              - isSaving (boolean, indica se é uma economia/poupança)
              - savingGoal (string ou null)
              
              Regras para categorização:
              - alimentacao: mercados, restaurantes, delivery, ifood, comida
              - moradia: aluguel, condomínio, água, luz, gás, manutenção
              - transporte: uber, 99, combustível, passagens, metrô, ônibus
              - internet: internet, wifi, telefone, celular, contas de operadoras
              - cartao: faturas, parcelas, crédito, juros, tarifas bancárias
              - saude: farmácia, médicos, hospitais, planos de saúde, exames
              - lazer: netflix, cinema, shows, eventos, viagens
              - compras: roupas, eletrônicos, produtos diversos, itens para casa
              - investimentos: aplicações, ações, previdência, rendimentos
              - familia: escola, mensalidades, despesas com filhos, creche
              - doacoes: doações, contribuições para causas

              Regras importantes:
              - Se o valor contiver "k" (ex: "2k"), multiplique por 1000
              - Para moeda brasileira (R$), extraia apenas o número
              - Detecte intenções de poupança ("poupar", "guardar", "economizar")
              - O padrão é "expense", a menos que haja claros indicadores de renda
              
              Retorne APENAS um objeto JSON com esses campos exatos.`
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
