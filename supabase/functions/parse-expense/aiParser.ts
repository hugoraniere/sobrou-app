
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
            content: `Você é um analista financeiro especializado em categorizar transações. Sua tarefa é extrair detalhes de transações financeiras descritas em texto e categorizá-las corretamente.

              IMPORTANTE: Identifique TODAS as transações mencionadas no texto. Analise cuidadosamente para separar transações múltiplas mencionadas na mesma frase.

              Para cada transação, extraia os seguintes campos:
              - amount (número, obrigatório)
              - type ("expense" para despesas ou "income" para receitas)
              - category (deve ser uma destas categorias exatas: alimentacao, moradia, transporte, internet, cartao, saude, lazer, compras, investimentos, familia, doacoes)
              - description (descrição específica da transação)
              - date (formato YYYY-MM-DD, use hoje se não especificada)
              
              Regras para categorização melhoradas:
              - alimentacao: mercados, restaurantes, delivery, ifood, comida, refeição, fast-food, lanchonetes, hambúrguer, pizza, açaí, padaria, café, lanche
              - moradia: aluguel, condomínio, água, luz, gás, manutenção, IPTU, decoração, reforma, móveis
              - transporte: uber, 99, combustível, passagens, metrô, ônibus, estacionamento, pedágio, manutenção de veículos, gasolina, posto
              - internet: internet, wifi, telefone, celular, contas de operadoras, streaming (Netflix, Spotify, etc)
              - cartao: faturas, parcelas, crédito, juros, tarifas bancárias, empréstimos
              - saude: farmácia, médicos, hospitais, planos de saúde, exames, dentista, psicólogo, remédio, medicamento
              - lazer: cinema, shows, eventos, viagens, bares, restaurantes (quando é lazer), streaming de entretenimento, jogos
              - compras: roupas, eletrônicos, produtos diversos, itens para casa, acessórios, cigarro, produtos de higiene, cosméticos
              - investimentos: aplicações, ações, previdência, rendimentos, poupança, tesouro direto
              - familia: escola, mensalidades, despesas com filhos, creche, material escolar
              - doacoes: doações, contribuições para causas, caridade, dízimo

              Regras importantes para TYPE:
              - Classifique como "income" (receita) se detectar palavras como: "recebi", "ganhei", "salário", "pagamento", "caiu na conta", "entrou", "faturei", "venda"
              - Classifique como "expense" (despesa) para gastos: "gastei", "paguei", "comprei"
              
              Formato de resposta:
              - Se UMA transação: retorne um objeto JSON
              - Se MÚLTIPLAS transações: retorne um array de objetos JSON
              
              Exemplos de múltiplas transações:
              - "Gastei 15 com hambúrguer e 12 com cigarro" → array com 2 objetos: [{amount: 15, description: "hambúrguer", category: "alimentacao"}, {amount: 12, description: "cigarro", category: "compras"}]
              - "Comprei café por 5 reais e almoço por 15 reais" → array com 2 objetos
              - "Gastei 20 no mercado, 10 no posto e 30 na farmácia" → array com 3 objetos
              
              Outras regras:
              - Se o valor contiver "k" (ex: "2k"), multiplique por 1000
              - Para moeda brasileira (R$), extraia apenas o número
              - Use data de hoje (${new Date().toISOString().split('T')[0]}) se não especificada
              - Sempre identifique transações separadas mesmo quando mencionadas em uma frase com "e"`
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
    
    // Try to extract JSON from the response
    const jsonMatch = parsedResult.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    console.log("Parsed AI result:", parsed);
    
    return parsed;
  } catch (error) {
    console.error("AI parsing error:", error);
    return null;
  }
}
