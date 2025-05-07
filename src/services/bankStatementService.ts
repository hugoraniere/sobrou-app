
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
    try {
      // Pré-processar o conteúdo para reduzir seu tamanho
      const processedContent = this.preprocessContent(content);
      
      const response = await supabase.functions.invoke('parse-bank-statement', {
        body: { textContent: processedContent }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao analisar extrato bancário');
      }
      
      // Obter transações do resultado
      const extractedTransactions = response.data.transactions || [];
      
      // Aplicar um mapeamento melhorado das categorias para cada transação
      const enhancedTransactions = extractedTransactions.map((tx: ExtractedTransaction) => {
        // Tentar obter uma categoria válida para esta transação
        const mappedCategory = mapToValidCategory(tx.category, tx.description, tx.amount, tx.type);
        
        return {
          ...tx,
          category: mappedCategory,
          selected: true  // Todas são selecionadas por padrão
        };
      });

      return enhancedTransactions || [];
    } catch (error: any) {
      console.error("Erro ao extrair transações:", error);
      throw new Error(error.message || "Não foi possível extrair transações do extrato");
    }
  },
  
  // Pré-processamento do conteúdo para reduzir seu tamanho e melhorar a performance
  preprocessContent(content: string): string {
    // Remover linhas muito longas (provavelmente código, imagens codificadas, etc)
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => line.trim().length < 500);
    
    // Remover linhas duplicadas
    const uniqueLines = Array.from(new Set(filteredLines));
    
    // Limitar o tamanho total
    const maxLength = 10000;
    let processedContent = uniqueLines.join('\n');
    if (processedContent.length > maxLength) {
      processedContent = processedContent.substring(0, maxLength);
    }
    
    return processedContent;
  },

  async importTransactions(selectedTransactions: ExtractedTransaction[]): Promise<ImportResult> {
    try {
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Lista de categorias válidas no sistema
      const validCategories = transactionCategories.map(cat => cat.id);

      // Converter para o formato de transação do sistema com validação de categoria
      const transactionsToInsert = selectedTransactions.map(tx => {
        // Tentar mapear para uma categoria válida
        let categoryToUse = tx.category;
        
        // Se a categoria não for válida, tentar obter uma a partir da descrição
        if (!categoryToUse || !validCategories.includes(categoryToUse)) {
          const categoryByDescription = getCategoryByKeyword(tx.description);
          if (categoryByDescription) {
            categoryToUse = categoryByDescription.id;
          } else {
            // Se não conseguirmos, usar nossa função de determinação de melhor categoria
            categoryToUse = determineBestCategory(tx.description, tx.amount, tx.type);
          }
        }

        return {
          user_id: user.id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          category: categoryToUse || 'compras' // Usar compras como fallback se for null
        };
      });

      // Inserir transações no banco em lotes de 20 para melhorar performance
      const batchSize = 20;
      const results = [];

      for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
        const batch = transactionsToInsert.slice(i, i + batchSize);
        const { data, error } = await supabase
          .from('transactions')
          .insert(batch);
          
        if (error) {
          console.error("Erro ao inserir lote de transações:", error);
          // Continuar mesmo com erro em um lote
          results.push({ success: false, error });
        } else {
          results.push({ success: true, data });
        }
      }

      // Verificar se todos os lotes foram inseridos com sucesso
      const hasErrors = results.some(r => !r.success);
      
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
