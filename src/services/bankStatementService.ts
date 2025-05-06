
import { supabase } from '@/integrations/supabase/client';
import { transactionCategories } from '@/data/categories';
import { toast } from 'sonner';

// Interface para a transação extraída
export interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  selected?: boolean;
}

// Função para mapear categorias da IA para categorias válidas do sistema
const mapToValidCategory = (aiCategory: string | undefined): string => {
  if (!aiCategory) return 'compras'; // Categoria padrão

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

  // Retornar a categoria original se não conseguirmos mapear
  // Isso permitirá que o usuário veja a categoria detectada pela IA e escolha uma apropriada
  return aiCategory;
};

export const bankStatementService = {
  async extractTransactionsFromContent(content: string): Promise<ExtractedTransaction[]> {
    try {
      const response = await supabase.functions.invoke('parse-bank-statement', {
        body: { textContent: content }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao analisar extrato bancário');
      }

      return response.data.transactions || [];
    } catch (error: any) {
      console.error("Erro ao extrair transações:", error);
      throw new Error(error.message || "Não foi possível extrair transações do extrato");
    }
  },

  async importTransactions(selectedTransactions: ExtractedTransaction[]): Promise<void> {
    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Lista de categorias válidas no sistema
    const validCategories = transactionCategories.map(cat => cat.id);

    // Converter para o formato de transação do sistema com validação de categoria
    const transactionsToInsert = selectedTransactions.map(tx => {
      // Tentar mapear para uma categoria válida, mas não forçar
      let categoryToUse = tx.category;
      
      // Se a categoria não for válida, deixar sem categoria (null)
      if (categoryToUse && !validCategories.includes(categoryToUse)) {
        categoryToUse = null;
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

    try {
      // Inserir transações no banco
      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (error) {
        console.error("Erro ao inserir transações:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Detalhes do erro:", error);
      throw error;
    }
  }
};
