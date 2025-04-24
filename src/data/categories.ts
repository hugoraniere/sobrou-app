
import { CategoryType } from '../types/categories';
import { expenseCategories } from './expenseCategories';

// Garantir que estamos sempre exportando um array, nunca undefined
export const transactionCategories: CategoryType[] = expenseCategories || [];

// Re-export important types and utilities
export type { CategoryType };
export * from '../utils/categoryUtils';

