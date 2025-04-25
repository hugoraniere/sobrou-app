
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CurrencyInput from './CurrencyInput';
import TransactionTypeSelector from './TransactionTypeSelector';
import { useTransactionForm } from '@/hooks/useTransactionForm';

interface TransactionFormProps {
  onSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { form, isSubmitting, handleSubmit } = useTransactionForm(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default TransactionForm;
