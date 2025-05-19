
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
              - description (deve ser EXATAMENTE igual ao texto original do usuário, sem alterações)
              - isSaving (boolean, indica se é uma economia/poupança)
              - savingGoal (string ou null)
              
              Regras para categorização:
              - alimentacao: mercados, restaurantes, delivery, ifood, comida, refeição, fast-food, lanchonetes
              - moradia: aluguel, condomínio, água, luz, gás, manutenção, IPTU, decoração, reforma, móveis
              - transporte: uber, 99, combustível, passagens, metrô, ônibus, estacionamento, pedágio, manutenção de veículos
              - internet: internet, wifi, telefone, celular, contas de operadoras, streaming (Netflix, Spotify, etc)
              - cartao: faturas, parcelas, crédito, juros, tarifas bancárias, empréstimos
              - saude: farmácia, médicos, hospitais, planos de saúde, exames, dentista, psicólogo
              - lazer: netflix (quando é lazer), cinema, shows, eventos, viagens, bares, restaurantes (quando é lazer)
              - compras: roupas, eletrônicos, produtos diversos, itens para casa, acessórios
              - investimentos: aplicações, ações, previdência, rendimentos, poupança, tesouro direto
              - familia: escola, mensalidades, despesas com filhos, creche, material escolar
              - doacoes: doações, contribuições para causas, caridade, dízimo

              Regras importantes para TYPE:
              - Classifique como "income" (receita) se detectar palavras como: "recebi", "ganhei", "salário", "pagamento", "caiu na conta", "entrou", "faturei", "venda"
              - Exemplos claros de RECEITAS: "Recebi R$2000 de salário", "Ganhei 50 reais com bets", "Caiu 1500 na minha conta", "Me pagaram o freela", "Vendi um celular por 800"
              - Classifique como "expense" (despesa) apenas quando houver clara indicação de gasto ou pagamento, como: "gastei", "paguei", "comprei"
              
              Outras regras importantes:
              - Se o valor contiver "k" (ex: "2k"), multiplique por 1000
              - Para moeda brasileira (R$), extraia apenas o número
              - Detecte intenções de poupança ("poupar", "guardar", "economizar")
              - MANTENHA O TEXT ORIGINAL EXATAMENTE IGUAL NO CAMPO DESCRIPTION. Não faça reformulações, correções ou melhorias no texto.
              - Não mude nenhuma palavra do texto original do usuário no campo "description".
              
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
    
    // Garantir que a descrição seja exatamente igual ao texto original
    parsed.description = text;
    
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
      description: text, // Sempre preservar o texto original
      isSaving: false,
      savingGoal: null
    };
  }
}
