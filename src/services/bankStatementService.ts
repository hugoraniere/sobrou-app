import { supabase } from '@/integrations/supabase/client';
import { transactionCategories } from '@/data/categories';
import { toast } from 'sonner';
import { determineBestCategory, getCategoryByKeyword } from '@/utils/categoryUtils';

// Interface para a transação extraída
export interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  selected?: boolean;
}

// Interface para o resultado da importação
interface ImportResult {
  success: boolean;
  message?: string;
  transactions?: any[];
}

// Função para validar data antes da inserção
const validateDate = (dateStr: string): string => {
  try {
    // Verificar se a data está no formato ISO (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    // Se já estiver no formato ISO, verificar se é válida
    if (datePattern.test(dateStr)) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return dateStr;
      }
    }
    
    // Verificar se a data está no formato DD/MM sem ano
    const shortDatePattern = /^(\d{1,2})\/(\d{1,2})$/;
    const shortDateMatch = dateStr.match(shortDatePattern);
    
    if (shortDateMatch) {
      const day = parseInt(shortDateMatch[1], 10);
      const month = parseInt(shortDateMatch[2], 10) - 1; // Mês em JS começa do zero
      const year = new Date().getFullYear(); // Usar o ano atual
      
      const date = new Date(year, month, day);
      
      // Verificar se a data resultante é válida
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Retornar no formato YYYY-MM-DD
      }
    }
    
    // Verificar se a data está no formato DD/MM/YYYY
    const fullDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const fullDateMatch = dateStr.match(fullDatePattern);
    
    if (fullDateMatch) {
      const day = parseInt(fullDateMatch[1], 10);
      const month = parseInt(fullDateMatch[2], 10) - 1; // Mês em JS começa do zero
      const year = parseInt(fullDateMatch[3], 10);
      
      const date = new Date(year, month, day);
      
      // Verificar se a data resultante é válida
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Retornar no formato YYYY-MM-DD
      }
    }
    
    // Se chegou aqui, a data não está em nenhum formato reconhecido
    console.warn(`Data inválida: ${dateStr}, usando data atual`);
    return new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  } catch (error) {
    console.error("Erro ao validar data:", error);
    return new Date().toISOString().split('T')[0];
  }
};

// Função para validar descrição
const validateDescription = (desc: string): string => {
  if (!desc || typeof desc !== 'string') {
    return 'Sem descrição';
  }
  // Limitar tamanho da descrição para evitar erros de campo muito grande
  return desc.substring(0, 255);
};

// Função para mapear categorias da IA para categorias válidas do sistema
const mapToValidCategory = (aiCategory: string | undefined, description: string, amount: number, type: string): string => {
  if (!aiCategory) {
    // Se não temos categoria, usar nossa função aprimorada de detecção
    return determineBestCategory(description, amount, type);
  }

  // Converter para um formato padronizado (minúsculas sem acentos)
  const normalizedCategory = aiCategory.toLowerCase().trim();
  
  // Mapeamento direto de categorias comuns da IA para nossas categorias do sistema
  const categoryMapping: Record<string, string> = {
    // Mapeamento para categorias de despesas
    'pagamento': 'cartao',
    'alimentação': 'alimentacao',
    'alimentacao': 'alimentacao',
    'mercado': 'alimentacao',
    'supermercado': 'alimentacao',
    'restaurante': 'alimentacao',
    'comida': 'alimentacao',
    'moradia': 'moradia',
    'aluguel': 'moradia',
    'casa': 'moradia',
    'transporte': 'transporte',
    'uber': 'transporte',
    'taxi': 'transporte',
    'combustível': 'transporte',
    'combustivel': 'transporte',
    'gasolina': 'transporte',
    'internet': 'internet',
    'telefone': 'internet',
    'wifi': 'internet',
    'telecom': 'internet',
    'fatura': 'cartao',
    'cartão': 'cartao',
    'cartao': 'cartao',
    'crédito': 'cartao',
    'credito': 'cartao',
    'anuidade': 'cartao',
    'banco': 'cartao',
    'saúde': 'saude',
    'saude': 'saude',
    'médico': 'saude',
    'medico': 'saude',
    'farmácia': 'saude',
    'farmacia': 'saude',
    'lazer': 'lazer',
    'entretenimento': 'lazer',
    'cinema': 'lazer',
    'netflix': 'lazer',
    'compras': 'compras',
    'shopping': 'compras',
    'loja': 'compras',
    'vestuário': 'compras',
    'vestuario': 'compras',
    'roupa': 'compras',
    'investimento': 'investimentos',
    'investimentos': 'investimentos',
    'poupança': 'investimentos',
    'poupanca': 'investimentos',
    'família': 'familia',
    'familia': 'familia',
    'escola': 'familia',
    'educação': 'familia',
    'educacao': 'familia',
    'doação': 'doacoes',
    'doacao': 'doacoes',
    'caridade': 'doacoes',
  };

  // Verificar se temos um mapeamento direto
  if (categoryMapping[normalizedCategory]) {
    return categoryMapping[normalizedCategory];
  }

  // Verificar se a categoria já é uma categoria válida do sistema
  const validCategories = transactionCategories.map(cat => cat.id);
  if (validCategories.includes(normalizedCategory)) {
    return normalizedCategory;
  }

  // Se não encontrarmos uma correspondência, tentar encontrar por palavra-chave parcial
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (normalizedCategory.includes(key)) {
      return value;
    }
  }

  // Tentar obter uma categoria a partir da descrição
  const categoryByDescription = getCategoryByKeyword(description);
  if (categoryByDescription) {
    return categoryByDescription.id;
  }

  // Usar nossa função de determinação de categoria como último recurso
  return determineBestCategory(description, amount, type);
};

export const bankStatementService = {
  async extractTransactionsFromContent(content: string): Promise<ExtractedTransaction[]> {
    console.log("Iniciando extração de transações do conteúdo");
    
    if (!content) {
      console.error("Conteúdo vazio enviado para análise");
      throw new Error("O conteúdo do extrato está vazio");
    }
    
    if (typeof content !== 'string') {
      console.error("Tipo de conteúdo inválido:", typeof content);
      throw new Error(`O conteúdo deve ser uma string, recebido: ${typeof content}`);
    }
    
    if (content.trim() === '') {
      console.error("Conteúdo contém apenas espaços em branco");
      throw new Error("O conteúdo do extrato contém apenas espaços em branco");
    }
    
    console.log("Tamanho do conteúdo original:", content.length);
    
    try {
      // Enviar conteúdo sem pré-processamento agressivo
      // Isso resolve o problema de "Conteúdo vazio após pré-processamento"
      const contentToSend = content;
      
      console.log("Enviando conteúdo para análise:", contentToSend.length, "caracteres");
      console.log("Amostra do conteúdo:", contentToSend.substring(0, 200) + "...");
      
      // Realizar a chamada para a função edge usando invoke
      console.log("Iniciando chamada para parse-bank-statement");
      
      const response = await supabase.functions.invoke('parse-bank-statement', {
        body: { textContent: contentToSend }
      }).catch(error => {
        console.error("Erro na chamada da função edge:", error);
        throw new Error("Falha na comunicação com o serviço de análise de extratos: " + (error.message || "erro desconhecido"));
      });
      
      console.log("Resposta da função edge recebida:", response);
      
      if (response.error) {
        console.error("Erro na função de parse:", response.error);
        throw new Error(response.error.message || 'Erro ao analisar extrato bancário');
      }
      
      if (!response.data) {
        console.error("Resposta da função sem dados:", response);
        throw new Error("A resposta do serviço de análise não contém dados");
      }
      
      // Obter transações do resultado
      const extractedTransactions = response.data.transactions || [];
      console.log("Transações extraídas:", extractedTransactions.length);
      
      if (extractedTransactions.length === 0) {
        console.warn("Nenhuma transação encontrada no extrato");
        throw new Error("Nenhuma transação foi identificada no extrato. Verifique o formato do arquivo.");
      }
      
      // Aplicar um mapeamento melhorado das categorias para cada transação
      const enhancedTransactions = this.enhanceTransactions(extractedTransactions);
      console.log("Transações aprimoradas:", enhancedTransactions.length);
      
      return enhancedTransactions || [];
    } catch (error: any) {
      console.error("Erro ao extrair transações:", error);
      throw new Error(error.message || "Não foi possível extrair transações do extrato");
    }
  },
  
  enhanceTransactions(transactions: ExtractedTransaction[]): ExtractedTransaction[] {
    return transactions.map((tx: ExtractedTransaction) => {
      try {
        // Validar dados
        const validDate = validateDate(tx.date);
        const validDescription = validateDescription(tx.description);
        const validAmount = typeof tx.amount === 'number' ? tx.amount : parseFloat(String(tx.amount));
        const validType = tx.type === 'income' || tx.type === 'expense' ? tx.type : 'expense';
        
        // Tentar obter uma categoria válida para esta transação
        const mappedCategory = mapToValidCategory(tx.category, validDescription, validAmount, validType);
        
        return {
          date: validDate,
          description: validDescription,
          amount: validAmount,
          type: validType,
          category: mappedCategory,
          selected: true  // Todas são selecionadas por padrão
        };
      } catch (error) {
        console.error("Erro ao processar transação individual:", error);
        // Retornar objeto com valores padrão para não quebrar o fluxo
        return {
          date: new Date().toISOString().split('T')[0],
          description: "Erro ao processar transação",
          amount: 0,
          type: 'expense' as const,
          category: 'compras',
          selected: false
        };
      }
    });
  },

  async importTransactions(selectedTransactions: ExtractedTransaction[]): Promise<ImportResult> {
    try {
      console.log("Iniciando importação de", selectedTransactions.length, "transações");
      // Obter usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Erro ao obter o usuário:", userError);
        throw new Error("Erro ao autenticar usuário: " + userError.message);
      }
      
      if (!userData || !userData.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const user = userData.user;

      // Lista de categorias válidas no sistema
      const validCategories = transactionCategories.map(cat => cat.id);

      // Converter para o formato de transação do sistema com validação de categoria
      const transactionsToInsert = selectedTransactions
        .filter(tx => tx !== null && tx !== undefined)
        .map(tx => {
          try {
            // Validação de dados
            const validDate = validateDate(tx.date);
            const validDescription = validateDescription(tx.description);
            const validAmount = typeof tx.amount === 'number' ? tx.amount : parseFloat(String(tx.amount));
            const validType = tx.type === 'income' || tx.type === 'expense' ? tx.type : 'expense';
            
            // Tentar mapear para uma categoria válida
            let categoryToUse = tx.category;
            
            // Se a categoria não for válida, tentar obter uma a partir da descrição
            if (!categoryToUse || !validCategories.includes(categoryToUse)) {
              const categoryByDescription = getCategoryByKeyword(validDescription);
              if (categoryByDescription) {
                categoryToUse = categoryByDescription.id;
              } else {
                // Se não conseguirmos, usar nossa função de determinação de melhor categoria
                categoryToUse = determineBestCategory(validDescription, validAmount, validType);
              }
            }

            return {
              user_id: user.id,
              date: validDate,
              description: validDescription,
              amount: validAmount,
              type: validType,
              category: categoryToUse || 'compras' // Usar compras como fallback se for null
            };
          } catch (error) {
            console.error("Erro ao preparar transação para inserção:", error);
            // Retornar null para filtrar depois
            return null;
          }
        })
        .filter(tx => tx !== null); // Remover transações inválidas

      if (transactionsToInsert.length === 0) {
        return {
          success: false,
          message: "Nenhuma transação válida para importar"
        };
      }

      console.log("Transações válidas para inserção:", transactionsToInsert.length);

      // Inserir transações no banco em lotes de 20 para melhorar performance
      const batchSize = 20; // Aumentado de 10 para 20
      const results = [];

      for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
        const batch = transactionsToInsert.slice(i, i + batchSize);
        console.log(`Inserindo lote ${i/batchSize + 1} com ${batch.length} transações`);
        
        const { data, error } = await supabase
          .from('transactions')
          .insert(batch);
          
        if (error) {
          console.error("Erro ao inserir lote de transações:", error);
          console.error("Detalhes do lote com erro:", JSON.stringify(batch, null, 2));
          
          // Continuar mesmo com erro em um lote
          results.push({ success: false, error });
        } else {
          results.push({ success: true, data });
        }
      }

      // Verificar se todos os lotes foram inseridos com sucesso
      const hasErrors = results.some(r => !r.success);
      const successfulInserts = results.filter(r => r.success).length;
      
      console.log(`Importação concluída: ${successfulInserts} lotes com sucesso, ${results.length - successfulInserts} lotes com erro`);
      
      if (hasErrors) {
        const errorCount = results.filter(r => !r.success).length;
        return { 
          success: true, 
          message: `Algumas transações podem não ter sido importadas corretamente (${errorCount} lotes com erro)` 
        };
      }
      
      return { 
        success: true,
        message: `${transactionsToInsert.length} transações importadas com sucesso!`
      };
    } catch (error: any) {
      console.error("Detalhes do erro na importação:", error);
      return {
        success: false,
        message: error.message || "Erro ao importar transações"
      };
    }
  }
};
