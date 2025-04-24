
import { CategoryType } from '../types/categories';
import { expenseCategories } from './expenseCategories';

// Exportando uma lista plana com todas as categorias
export const transactionCategories = expenseCategories;

// Re-export important types and utilities
export type { CategoryType };
export * from '../utils/categoryUtils';
