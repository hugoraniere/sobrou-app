
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
        // Normalize category first
        let normalizedCategory = transaction.category;
        
        // Handle common AI-returned categories that need normalization
        const categoryMapping: Record<string, string> = {
          'academia': 'saude',
          'gym': 'saude',
          'fitness': 'saude',
          'amazon': 'compras',
          'mercado livre': 'compras',
          'netflix': 'internet',
          'spotify': 'internet',
          'cashback': 'outros',
          'freelancer': 'outros',
          'freelance': 'outros',
          'renda extra': 'outros',
          'other': 'outros',
          'Other': 'outros'
        };
        
        if (categoryMapping[normalizedCategory]) {
          normalizedCategory = categoryMapping[normalizedCategory];
        }
        
        // Try to determine category based on keywords if not provided or invalid
        if (!normalizedCategory || normalizedCategory === 'Other' || normalizedCategory === 'outros') {
          const detectedCategory = getCategoryByKeyword(transaction.description);
          if (detectedCategory) {
            normalizedCategory = detectedCategory.id;
          } else {
            normalizedCategory = 'outros';
          }
        }
        
        return {
          ...transaction,
          category: normalizedCategory
        };
      });
      
      // Return in original format (single or array)
      return Array.isArray(data) ? processedTransactions : processedTransactions[0];
    } catch (error) {
      console.error('Error parsing expense text:', error);
      throw error;
    }
  }
};
