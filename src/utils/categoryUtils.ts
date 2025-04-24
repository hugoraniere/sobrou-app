
import { CategoryType } from '../types/categories';

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
