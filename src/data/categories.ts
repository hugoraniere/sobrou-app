
import { CategoryType } from '../types/categories';
import { expenseCategories } from './expenseCategories';

// Garantir que estamos sempre exportando um array, nunca undefined
// Normalizar todas as categorias para usar "outros" em vez de "other"
const normalizedCategories = Array.isArray(expenseCategories) ? expenseCategories.map(cat => ({
  ...cat,
  value: cat.value === 'other' ? 'outros' : cat.value,
  id: cat.id === 'other' ? 'outros' : cat.id
})) : [];

export const transactionCategories: CategoryType[] = normalizedCategories;

// Re-export important types and utilities
export type { CategoryType };
export * from '../utils/categoryUtils';
export { getCategoryIcon, categoryIcons } from '../utils/categoryIcons';
