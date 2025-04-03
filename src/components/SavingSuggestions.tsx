
import React from 'react';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface SavingSuggestionsProps {
  expenses: Expense[];
}

export const SavingSuggestions: React.FC<SavingSuggestionsProps> = ({ expenses }) => {
  // Generate saving suggestions based on expense data
  const generateSuggestions = () => {
    if (expenses.length === 0) return [];
    
    const suggestions = [];
    
    // Group expenses by category
    const categoryMap = new Map<string, number>();
    expenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    
    // Convert to array and sort by amount (highest first)
    const categorySums = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    // Generate suggestions for top 2 categories
    const topCategories = categorySums.slice(0, 2);
    
    topCategories.forEach(({ category, amount }) => {
      const savings = amount * 0.1; // Suggest 10% savings
      
      if (category === 'Food') {
        suggestions.push({
          title: `Save on Food`,
          description: `Cutting 10% from your food expenses could save you $${savings.toFixed(2)} per month. Consider meal prepping or reducing delivery orders.`
        });
      } else if (category === 'Entertainment') {
        suggestions.push({
          title: `Reduce Entertainment Costs`,
          description: `Trimming 10% of your entertainment budget would save you $${savings.toFixed(2)}. Try free activities or sharing subscriptions with friends.`
        });
      } else if (category === 'Shopping') {
        suggestions.push({
          title: `Shop Smarter`,
          description: `A 10% reduction in shopping could save you $${savings.toFixed(2)}. Try waiting 24 hours before making non-essential purchases.`
        });
      } else {
        suggestions.push({
          title: `Optimize ${category} Spending`,
          description: `Reducing your ${category.toLowerCase()} expenses by 10% could save you $${savings.toFixed(2)}. Track your spending more closely in this category.`
        });
      }
    });
    
    // Add general suggestions
    suggestions.push({
      title: 'Track Daily Expenses',
      description: 'Send all your expenses to WhatsApp as they happen for more accurate financial insights.'
    });
    
    return suggestions;
  };
  
  const suggestions = generateSuggestions();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Saving Suggestions</h2>
      
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-medium text-blue-700">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Add more expense data to get personalized saving suggestions.</p>
      )}
      
      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium mb-2">How to use FinanceBot</h3>
        <p className="text-sm text-gray-600">
          Simply send expense messages to our WhatsApp number like:
        </p>
        <div className="bg-gray-50 p-3 rounded my-2 text-sm">
          <p className="font-medium">Spent 50 on groceries</p>
          <p className="font-medium">Rent 1200</p>
          <p className="font-medium">15.50 coffee yesterday</p>
        </div>
        <p className="text-sm text-gray-600">
          The AI will automatically parse your message and add the expense to your dashboard.
        </p>
      </div>
    </div>
  );
};
