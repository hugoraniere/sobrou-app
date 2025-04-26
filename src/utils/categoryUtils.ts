
import { transactionCategories } from '@/data/categories';

export const getCategoryByKeyword = (text: string): { id: string, name: string } | null => {
  if (!text) return null;
  
  const textLower = text.toLowerCase();
  
  // Primeira tentativa: correspondência exata com o nome
  const exactMatch = transactionCategories.find(
    cat => cat.name.toLowerCase() === textLower || textLower.includes(cat.name.toLowerCase())
  );
  
  if (exactMatch) return { id: exactMatch.id, name: exactMatch.name };
  
  // Segunda tentativa: verificar palavras-chave no texto
  const keywordMap: Record<string, string[]> = {
    'food': ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'meal', 'café', 'restaurante', 'almoço', 'jantar', 'café da manhã', 'refeição'],
    'transport': ['transport', 'car', 'gas', 'uber', 'taxi', 'bus', 'train', 'fuel', 'gasolina', 'carro', 'ônibus', 'transporte', 'metrô', 'combustível'],
    'shopping': ['shop', 'amazon', 'purchase', 'buy', 'store', 'mall', 'mercado', 'loja', 'compra', 'comprei'],
    'house': ['house', 'rent', 'mortgage', 'apartment', 'casa', 'aluguel', 'hipoteca', 'apartamento', 'condomínio'],
    'utilities': ['utilities', 'electric', 'water', 'internet', 'phone', 'bill', 'conta', 'água', 'luz', 'telefone', 'celular'],
    'entertainment': ['entertainment', 'movie', 'netflix', 'spotify', 'concert', 'theater', 'cinema', 'show', 'filme', 'entretenimento', 'teatro'],
    'health': ['health', 'doctor', 'medicine', 'pharmacy', 'hospital', 'medical', 'saúde', 'médico', 'remédio', 'farmácia', 'hospital'],
    'education': ['education', 'school', 'course', 'book', 'educação', 'escola', 'curso', 'livro', 'faculdade'],
    'salary': ['salary', 'wage', 'income', 'payment', 'salário', 'renda', 'pagamento', 'salario'],
    'investment': ['invest', 'dividend', 'stock', 'bond', 'investimento', 'dividendo', 'ação', 'título'],
    'other': []
  };
  
  for (const [categoryId, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      const category = transactionCategories.find(cat => cat.id === categoryId);
      if (category) return { id: category.id, name: category.name };
    }
  }
  
  // Nenhuma correspondência, retornar null
  return null;
};
