
import { supabase } from '@/integrations/supabase/client';

// Interface para a transação extraída
export interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  selected?: boolean;
}

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

    // Converter para o formato de transação do sistema
    const transactionsToInsert = selectedTransactions.map(tx => ({
      user_id: user.id,
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category: tx.category || 'outros'
    }));

    // Inserir transações no banco
    const { error } = await supabase
      .from('transactions')
      .insert(transactionsToInsert);

    if (error) {
      throw error;
    }
  }
};
