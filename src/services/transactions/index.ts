
export * from './types';
import { parseExpenseService } from './parseExpenseService';
import { transactionQueryService } from './transactionQueryService';
import { transactionMutationService } from './transactionMutationService';
import { transactionAnalyticsService } from './transactionAnalyticsService';

export const TransactionService = {
  // Expense parsing
  parseExpenseText: parseExpenseService.parseExpenseText,
  
  // Queries
  getTransactions: transactionQueryService.getTransactions,
  getTransactionsByDateRange: transactionQueryService.getTransactionsByDateRange,
  
  // Mutations
  addTransaction: transactionMutationService.addTransaction,
  updateTransaction: transactionMutationService.updateTransaction,
  deleteTransaction: transactionMutationService.deleteTransaction,
  
  // Analytics
  getTransactionSummary: transactionAnalyticsService.getTransactionSummary
};
