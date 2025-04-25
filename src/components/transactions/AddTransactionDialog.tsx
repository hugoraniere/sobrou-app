
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import TransactionTypeSelector from './components/TransactionTypeSelector';
import CurrencyInput from './components/CurrencyInput';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { parseCurrencyToNumber } from '@/utils/currencyUtils';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

// Schema for transaction form validation
const transactionFormSchema = z.object({
  description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres" }),
  amount: z.string().min(1, { message: "O valor é obrigatório" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  date: z.date(),
  type: z.enum(["income", "expense"])
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ 
  open, 
  onOpenChange,
  onTransactionAdded 
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Initialize form with validation
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: '',
      category: 'other',
      date: new Date(),
      type: 'expense'
    },
  });

  // Handle form submission
  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          description: data.description,
          amount: parseCurrencyToNumber(data.amount),
          category: data.category,
          date: data.date.toISOString().split('T')[0],
          type: data.type,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast.success(t('transactions.addSuccess', 'Transação adicionada com sucesso'));
      
      form.reset();
      onOpenChange(false);
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error(t('transactions.addError', 'Erro ao adicionar transação'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('transactions.add', 'Adicionar Transação')}</DialogTitle>
          <DialogDescription>
            {t('transactions.addDescription', 'Preencha os detalhes da nova transação')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TransactionTypeSelector 
              value={form.watch('type')} 
              onValueChange={(value) => form.setValue('type', value)}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.description', 'Descrição')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('transactions.descriptionPlaceholder', 'Ex: Supermercado')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CurrencyInput 
              name="amount"
              control={form.control}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.category', 'Categoria')}</FormLabel>
                  <FormControl>
                    <CategorySelector 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('transactions.date', 'Data')}</FormLabel>
                  <FormControl>
                    <TransactionDatePicker 
                      date={field.value} 
                      onDateChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.saving', 'Salvando...') : t('common.save', 'Salvar')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
