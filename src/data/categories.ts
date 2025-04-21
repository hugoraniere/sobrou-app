
import { CategoryType } from '../types/categories';
import { incomeCategories } from './incomeCategories';
import { expenseCategories } from './expenseCategories';

// Exportando as categorias agrupadas
export const categories = {
  income: incomeCategories,
  expense: expenseCategories
};

// Exportando uma lista plana com todas as categorias
export const transactionCategories = [
  ...incomeCategories,
  ...expenseCategories
];

// Re-export important types and utilities
export type { CategoryType };
export * from '../utils/categoryUtils';
