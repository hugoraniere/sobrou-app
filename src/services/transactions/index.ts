
export * from './types';
export { parseExpenseService } from './parseExpenseService';
export { transactionQueryService } from './transactionQueryService';
export { transactionMutationService } from './transactionMutationService';
export { transactionAnalyticsService } from './transactionAnalyticsService';

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
