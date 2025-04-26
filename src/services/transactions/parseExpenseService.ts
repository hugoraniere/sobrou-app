
import { ParsedExpense } from './types';
import { supabase } from "@/integrations/supabase/client";
import { getCategoryByKeyword } from "@/utils/categoryUtils";

export const parseExpenseService = {
  async parseExpenseText(text: string): Promise<ParsedExpense> {
    try {
      console.log("Enviando texto para a função parse-expense:", text);
      const response = await fetch('https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/parse-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldnNhenB3Zm93aG1qdXB1dXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjcsImV4cCI6MjA1OTM0NDkyN30.ZvIahA6EAPrVKSEUoRXDFJn6LeyqF-7_QM-Qv5O8Pn8'
        },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Parse expense error response:', errorData);
        throw new Error(`Failed to parse expense text: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Parsed expense data:", data);
      
      // Try to determine category based on keywords if not provided
      if (!data.category || data.category === 'Other') {
        const detectedCategory = getCategoryByKeyword(data.description);
        if (detectedCategory) {
          data.category = detectedCategory.id;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error parsing expense text:', error);
      throw error;
    }
  }
};
