
import { ParsedExpense } from './types';
import { supabase } from "@/integrations/supabase/client";
import { getCategoryByKeyword } from "@/utils/categoryUtils";

export const parseExpenseService = {
  async parseExpenseText(text: string): Promise<ParsedExpense | ParsedExpense[]> {
    try {
      console.log("Enviando texto para a função parse-expense:", text);
      
      // Use Supabase functions.invoke for more robust error handling
      const { data, error } = await supabase.functions.invoke('parse-expense', {
        body: { text }
      });
      
      if (error) {
        console.error('Parse expense error:', error);
        throw new Error(`Failed to parse expense text: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from parse-expense function');
      }
      console.log("Parsed expense data:", data);
      
      // Normalize to array format
      const transactions = Array.isArray(data) ? data : [data];
      
      // Process each transaction
      const processedTransactions = transactions.map(transaction => {
        // Try to determine category based on keywords if not provided
        if (!transaction.category || transaction.category === 'Other' || transaction.category === 'outros') {
          const detectedCategory = getCategoryByKeyword(transaction.description);
          if (detectedCategory) {
            transaction.category = detectedCategory.id;
          } else {
            transaction.category = 'other';
          }
        }
        return transaction;
      });
      
      // Return in original format (single or array)
      return Array.isArray(data) ? processedTransactions : processedTransactions[0];
    } catch (error) {
      console.error('Error parsing expense text:', error);
      throw error;
    }
  }
};
