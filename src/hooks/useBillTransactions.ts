
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billTransactionsService } from '@/services/billTransactionsService';
import { CreateBillTransactionData } from '@/types/billTransactions';
import { toast } from 'sonner';

export const useBillTransactions = (billId: string) => {
  const queryClient = useQueryClient();

  const {
    data: transactions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['bill-transactions', billId],
    queryFn: () => billTransactionsService.getBillTransactions(billId),
    enabled: !!billId,
  });

  const createTransactionMutation = useMutation({
    mutationFn: billTransactionsService.createBillTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bill-transactions', billId] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Transação adicionada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao adicionar transação');
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: billTransactionsService.deleteBillTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bill-transactions', billId] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Transação removida com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao remover transação');
    },
  });

  return {
    transactions,
    isLoading,
    error,
    createTransaction: (data: CreateBillTransactionData) => createTransactionMutation.mutate(data),
    deleteTransaction: (id: string) => deleteTransactionMutation.mutate(id),
    isCreating: createTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
  };
};

export const useBillBalance = (billId: string, originalAmount: number) => {
  return useQuery({
    queryKey: ['bill-balance', billId],
    queryFn: () => billTransactionsService.calculateBillBalance(billId, originalAmount),
    enabled: !!billId,
  });
};
