
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parseCurrencyToNumber } from '@/utils/currencyUtils';

const transactionFormSchema = z.object({
  description: z.string().optional(),
  amount: z.string().min(1, { message: "O valor é obrigatório" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  date: z.date(),
  type: z.enum(["income", "expense"])
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const useTransactionForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: '',
      category: 'other',
      date: new Date(),
      type: 'expense'
    },
    mode: 'onChange'
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          description: data.description || null,
          amount: parseCurrencyToNumber(data.amount),
          category: data.category,
          date: data.date.toISOString().split('T')[0],
          type: data.type,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast.success('Transação adicionada com sucesso');
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
      
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error('Erro ao adicionar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
