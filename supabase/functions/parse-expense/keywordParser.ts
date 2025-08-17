
import { CATEGORY_MAPPING, INCOME_KEYWORDS, SAVING_KEYWORDS } from './constants.ts';

interface ParsedExpense {
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  isSaving: boolean;
  savingGoal: string | null;
}

export function parseExpenseText(text: string): ParsedExpense {
  text = text.toLowerCase();
  console.log("Parsing text:", text);
  
  // Extract amount
  const amountRegex = /(r\$|\$)?(\d+(?:[.,]\d+)?)/i;
  const amountMatch = text.match(amountRegex);
  let amount = 0;
  
  if (amountMatch) {
    amount = parseFloat(amountMatch[2].replace(',', '.'));
  }
  
  // Determine type and saving status
  let type = "expense";
  let isSaving = false;
  
  for (const keyword of INCOME_KEYWORDS) {
    if (text.includes(keyword)) {
      type = "income";
      break;
    }
  }
  
  for (const keyword of SAVING_KEYWORDS) {
    if (text.includes(keyword)) {
      isSaving = true;
      break;
    }
  }
  
  // Extract date
  const today = new Date();
  let date = today.toISOString().split('T')[0];
  
  if (text.includes("ontem")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  } else if (text.includes("semana passada")) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    date = lastWeek.toISOString().split('T')[0];
  } else if (text.includes("mês passado") || text.includes("mes passado")) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    date = lastMonth.toISOString().split('T')[0];
  }
  
  // Determine category with better matching logic
  let category = "other";
  let bestMatch = "";
  let bestCategory = "";

  // Helper function to remove accents
  function removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const normalizedText = removeAccents(text.toLowerCase());

  // Look for the longest/most specific match first
  for (const [cat, keywords] of Object.entries(CATEGORY_MAPPING)) {
    for (const keyword of keywords) {
      const normalizedKeyword = removeAccents(keyword.toLowerCase());
      if (normalizedText.includes(normalizedKeyword)) {
        // Prioritize longer matches (more specific)
        if (normalizedKeyword.length > bestMatch.length) {
          bestMatch = normalizedKeyword;
          bestCategory = cat;
        }
      }
    }
  }

  if (bestCategory) {
    category = bestCategory;
  }

  // If it's food-related, default to 'alimentacao'
  if (text.includes("mercado") || text.includes("comida")) {
    category = "alimentacao";
  }
  
  // Extract saving goal
  let savingGoal = null;
  if (isSaving) {
    const savingWords = ["para", "em"];
    for (const word of savingWords) {
      const regex = new RegExp(`${word} ([\\w\\s]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        savingGoal = match[1].trim();
        break;
      }
    }
    
    if (!savingGoal) {
      savingGoal = "Poupança Geral";
    }
  }
  
  // Generate description
  let description = text;
  if (description.length > 50) {
    description = description.substring(0, 47) + "...";
  }
  
  return {
    amount,
    type,
    category,
    date,
    description,
    isSaving,
    savingGoal
  };
}
