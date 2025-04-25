
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

// Helper function to format currency input
const formatCurrencyInput = (value: string): string => {
  // Remove any non-digit characters except comma
  let cleanValue = value.replace(/[^\d,]/g, '');
  
  // Replace comma with dot for conversion
  cleanValue = cleanValue.replace(',', '.');
  
  // Convert to number and format
  const number = parseFloat(cleanValue);
  if (isNaN(number)) return '';
  
  // Format as Brazilian currency
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Helper function to parse Brazilian currency to number
const parseCurrencyToNumber = (value: string): number => {
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

// Schema for transaction form validation
const transactionFormSchema = z.object({
  description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres" }),
  amount: z.string().min(1, { message: "O valor é obrigatório" }).transform(val => parseCurrencyToNumber(val)),
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

  // Default values for the form
  const defaultValues: Partial<TransactionFormValues> = {
    description: '',
    amount: '',
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: data.date.toISOString().split('T')[0],
          type: data.type,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast.success(t('transactions.addSuccess', 'Transação adicionada com sucesso'));
      
      form.reset(defaultValues);
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
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <Input
                        type="text"
                        placeholder="0,00"
                        className="pl-9"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </div>
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
