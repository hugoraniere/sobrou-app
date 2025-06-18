
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billsService } from '@/services/billsService';
import { CreateBillData, UpdateBillData } from '@/types/bills';
import { toast } from 'sonner';

const BILLS_QUERY_KEY = ['bills'];

export const useBillsData = () => {
  const queryClient = useQueryClient();

  const {
    data: bills = [],
    isLoading,
    error
  } = useQuery({
    queryKey: BILLS_QUERY_KEY,
    queryFn: billsService.getBills,
  });

  const createBillMutation = useMutation({
    mutationFn: billsService.createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
      toast.success('Conta criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating bill:', error);
      toast.error('Erro ao criar conta');
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBillData }) =>
      billsService.updateBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
      toast.success('Conta atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating bill:', error);
      toast.error('Erro ao atualizar conta');
    },
  });

  const deleteBillMutation = useMutation({
    mutationFn: billsService.deleteBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
      toast.success('Conta excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting bill:', error);
      toast.error('Erro ao excluir conta');
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: billsService.markAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
      toast.success('Conta marcada como paga!');
    },
    onError: (error) => {
      console.error('Error marking bill as paid:', error);
      toast.error('Erro ao marcar conta como paga');
    },
  });

  const markAsUnpaidMutation = useMutation({
    mutationFn: billsService.markAsUnpaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
      toast.success('Conta marcada como não paga!');
    },
    onError: (error) => {
      console.error('Error marking bill as unpaid:', error);
      toast.error('Erro ao marcar conta como não paga');
    },
  });

  return {
    bills,
    isLoading,
    error,
    createBill: (data: CreateBillData) => createBillMutation.mutate(data),
    updateBill: (id: string, data: UpdateBillData) => updateBillMutation.mutate({ id, data }),
    deleteBill: (id: string) => deleteBillMutation.mutate(id),
    markAsPaid: (id: string) => markAsPaidMutation.mutate(id),
    markAsUnpaid: (id: string) => markAsUnpaidMutation.mutate(id),
    isCreating: createBillMutation.isPending,
    isUpdating: updateBillMutation.isPending,
    isDeleting: deleteBillMutation.isPending,
  };
};
