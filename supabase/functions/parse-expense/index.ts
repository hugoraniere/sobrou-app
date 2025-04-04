
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Simple NLP function to parse expense information from user text input
 * In a real application, this would use a more sophisticated NLP model
 */
function parseExpenseText(text: string) {
  text = text.toLowerCase();
  
  // Extract amount
  const amountRegex = /(\$|r\$)?(\d+(\.\d+)?)/i;
  const amountMatch = text.match(amountRegex);
  const amount = amountMatch ? parseFloat(amountMatch[2]) : 0;
  
  // Determine type (expense or income)
  const incomeKeywords = ["received", "earned", "salary", "income", "payment", "paid me", "freelance", "bonus"];
  const savingKeywords = ["saved", "saving", "savings", "put aside", "fund", "goal"];
  const recurringKeywords = ["monthly", "weekly", "recurring", "every month", "subscription", "bill"];
  
  let type = "expense"; // default
  let isSaving = false;
  let isRecurring = false;
  let recurrenceInterval = null;
  
  for (const keyword of incomeKeywords) {
    if (text.includes(keyword)) {
      type = "income";
      break;
    }
  }
  
  for (const keyword of savingKeywords) {
    if (text.includes(keyword)) {
      isSaving = true;
      break;
    }
  }
  
  for (const keyword of recurringKeywords) {
    if (text.includes(keyword)) {
      isRecurring = true;
      if (text.includes("weekly")) {
        recurrenceInterval = "weekly";
      } else if (text.includes("monthly")) {
        recurrenceInterval = "monthly";
      } else if (text.includes("yearly") || text.includes("annual")) {
        recurrenceInterval = "yearly";
      } else {
        recurrenceInterval = "monthly"; // default
      }
      break;
    }
  }
  
  // Extract date
  const today = new Date();
  let date = today.toISOString().split('T')[0];
  
  if (text.includes("yesterday")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  } else if (text.includes("last week")) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    date = lastWeek.toISOString().split('T')[0];
  } else if (text.includes("last month")) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    date = lastMonth.toISOString().split('T')[0];
  }
  
  // Determine category
  let category = "Other";
  
  const categoryMapping: Record<string, string[]> = {
    "Food": ["food", "grocery", "groceries", "restaurant", "lunch", "dinner", "breakfast", "meal", "snack", "coffee"],
    "Transportation": ["transport", "uber", "lyft", "taxi", "bus", "train", "gas", "fuel", "car", "ride"],
    "Housing": ["rent", "mortgage", "apartment", "house", "housing"],
    "Entertainment": ["movie", "game", "entertainment", "concert", "theatre", "theater", "show"],
    "Shopping": ["clothes", "clothing", "shop", "shopping", "mall", "store", "amazon"],
    "Utilities": ["electricity", "water", "bill", "utility", "utilities", "internet", "phone", "subscription"],
    "Health": ["doctor", "medical", "medicine", "health", "healthcare", "hospital", "therapy"],
    "Education": ["book", "course", "class", "tuition", "education", "school", "college", "university"],
    "Income": ["salary", "wage", "payment", "income", "freelance", "contract", "bonus", "received"],
    "Savings": ["saving", "saved", "fund", "emergency"]
  };
  
  for (const [cat, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        category = cat;
        break;
      }
    }
    if (category !== "Other") break;
  }
  
  // If it's an income, force category to be Income
  if (type === "income") {
    category = "Income";
  }
  
  // Extract saving goal name if it's a saving
  let savingGoal = null;
  if (isSaving) {
    const savingWords = ["for", "to", "in", "into"];
    for (const word of savingWords) {
      const regex = new RegExp(`${word} ([\\w\\s]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        savingGoal = match[1].trim();
        break;
      }
    }
    
    // Default saving goal if none specified
    if (!savingGoal) {
      savingGoal = "General Savings";
    }
  }
  
  // Generate a description
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
    savingGoal,
    is_recurring: isRecurring,
    recurrence_interval: recurrenceInterval
  };
}

serve(async (req) => {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text input is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const parsedData = parseExpenseText(text);
    
    return new Response(
      JSON.stringify(parsedData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
