
import { CategoryType } from '../types/categories';
import { categoryKeywords, categoryMeta } from '../data/categoryKeywords';

/**
 * Detecta categorias com base no texto
 * @param text Texto para análise
 * @param categories Lista de categorias para comparação
 * @returns Lista de categorias detectadas
 */
export const detectCategories = (
  text: string, 
  categories: CategoryType[]
): CategoryType[] => {
  if (!text || !categories || !Array.isArray(categories)) {
    return [];
  }
  
  // Implementação básica - expandir conforme necessário
  const lowerText = text.toLowerCase();
  return categories.filter(category => 
    category.name.toLowerCase().includes(lowerText) || 
    category.label.toLowerCase().includes(lowerText)
  );
};

/**
 * Encontra uma categoria pelo seu ID ou valor
 * @param categoryId ID ou valor da categoria 
 * @param categories Lista de categorias
 * @returns Categoria encontrada ou undefined
 */
export const findCategoryById = (
  categoryId: string,
  categories: CategoryType[]
): CategoryType | undefined => {
  if (!categoryId || !categories || !Array.isArray(categories)) {
    return undefined;
  }
  
  return categories.find(
    category => category.id === categoryId || category.value === categoryId
  );
};

/**
 * Detecta categoria com base em palavras-chave no texto
 * @param text Texto para análise
 * @returns Categoria detectada ou null
 */
export const getCategoryByKeyword = (text: string): CategoryType | null => {
  if (!text) return null;
  
  const normalizedText = text.toLowerCase().trim();
  
  // Iterar sobre as palavras-chave para encontrar correspondências
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    if (Array.isArray(keywords)) {
      const matchesKeyword = keywords.some(keyword => 
        normalizedText.includes(keyword.toLowerCase())
      );
      
      if (matchesKeyword && categoryMeta[categoryId]) {
        return categoryMeta[categoryId];
      }
    }
  }
  
  return null;
};

