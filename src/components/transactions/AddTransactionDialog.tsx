
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Schema for transaction form validation
const transactionFormSchema = z.object({
  description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres" }),
  amount: z.number().min(0.01, { message: "O valor deve ser maior que 0" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  date: z.date(),
  type: z.enum(["income", "expense"])
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Default values for the form
  const defaultValues: Partial<TransactionFormValues> = {
    description: '',
    amount: 0,
    category: 'other',
    date: new Date(),
    type: 'expense'
  };

  // Initialize form with validation
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Insert transaction in the database
      const { error } = await supabase
        .from('transactions')
        .insert({
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: data.date.toISOString().split('T')[0],
          type: data.type
        });
      
      if (error) throw error;
      
      toast.success(t('transactions.addSuccess', 'Transação adicionada com sucesso'));
      
      // Reset form and close dialog
      form.reset(defaultValues);
      onOpenChange(false);
      
      // Refresh transaction data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error(t('transactions.addError', 'Erro ao adicionar transação'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get form type value to control tabs
  const transactionType = form.watch('type');

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
            <Tabs 
              value={transactionType} 
              onValueChange={(value) => form.setValue('type', value as 'income' | 'expense')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">
                  {t('transactions.expense', 'Despesa')}
                </TabsTrigger>
                <TabsTrigger value="income">
                  {t('transactions.income', 'Receita')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
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
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.amount', 'Valor')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                      setDate={field.onChange} 
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
