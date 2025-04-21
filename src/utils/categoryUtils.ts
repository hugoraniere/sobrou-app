
import { CategoryType } from '../types/categories';
import { transactionCategories } from '../data/categories';

export const getCategoryByKeyword = (text: string): CategoryType | null => {
  if (!text) return null;
  
  const normalizedText = text.toLowerCase().trim();
  
  const keywordMap: Record<string, string> = {
    // Receitas
    'salário': 'salary',
    'salario': 'salary',
    'pagamento': 'salary',
    'freelance': 'freelance',
    'freela': 'freelance',
    'projeto': 'freelance',
    
    // Despesas
    'comida': 'food',
    'restaurante': 'food',
    'almoço': 'food',
    'almoco': 'food',
    'jantar': 'food',
    'café': 'food',
    'cafe': 'food',
    'mercado': 'food',
    'supermercado': 'food',
    
    'transporte': 'transport',
    'uber': 'transport',
    'táxi': 'transport',
    'taxi': 'transport',
    'ônibus': 'transport',
    'onibus': 'transport',
    'metrô': 'transport',
    'metro': 'transport',
    'gasolina': 'transport',
    'combustível': 'transport',
    'combustivel': 'transport',
    
    'conta': 'utilities',
    'contas': 'utilities',
    'água': 'utilities',
    'agua': 'utilities',
    'luz': 'utilities',
    'energia': 'utilities',
    'gás': 'utilities',
    'gas': 'utilities',
    'internet': 'utilities',
    'telefone': 'utilities',
    'celular': 'utilities',
    'aluguel': 'utilities'
  };
  
  for (const [keyword, categoryId] of Object.entries(keywordMap)) {
    if (normalizedText.includes(keyword)) {
      const foundCategory = transactionCategories.find(c => c.value === categoryId);
      if (foundCategory) return foundCategory;
    }
  }
  
  return null;
};
