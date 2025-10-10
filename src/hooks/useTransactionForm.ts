
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { parseCurrencyToNumber } from '@/utils/currencyUtils';

const transactionFormSchema = z.object({
  description: z.string().optional(),
  amount: z.string().min(1, { message: "O valor é obrigatório" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  // M3: Campos MEI
  competence_date: z.date().optional(),
  payment_method: z.string().optional(),
  status: z.enum(["paid", "pending"]).optional(),
  client: z.string().optional(),
  project: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export interface TaxSuggestion {
  show: boolean;
  amount: number;
  percentage: number;
}

export const useTransactionForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxSuggestion, setTaxSuggestion] = useState<TaxSuggestion>({ show: false, amount: 0, percentage: 0 });
  const queryClient = useQueryClient();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: '',
      category: 'outros',
      date: new Date(),
      type: 'expense',
      status: 'paid',
      tags: [],
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

      const amount = parseCurrencyToNumber(data.amount);
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          description: data.description || null,
          amount,
          category: data.category,
          date: format(data.date, 'yyyy-MM-dd'),
          type: data.type,
          user_id: user.id,
          // M3: Campos MEI
          competence_date: data.competence_date ? format(data.competence_date, 'yyyy-MM-dd') : null,
          payment_method: data.payment_method || null,
          status: data.status || 'paid',
          client: data.client || null,
          project: data.project || null,
          tags: data.tags || null,
        });
      
      if (error) throw error;
      
      toast.success('Transação adicionada com sucesso');

      // M4: Mostrar sugestão de reserva de impostos para receitas
      if (data.type === 'income') {
        const { data: meiSettings } = await supabase
          .from('mei_settings')
          .select('tax_reserve_percentage')
          .eq('user_id', user.id)
          .maybeSingle();

        if (meiSettings) {
          setTaxSuggestion({
            show: true,
            amount,
            percentage: meiSettings.tax_reserve_percentage,
          });
        }
      }

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

  const dismissTaxSuggestion = () => {
    setTaxSuggestion({ show: false, amount: 0, percentage: 0 });
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    taxSuggestion,
    dismissTaxSuggestion,
  };
};
