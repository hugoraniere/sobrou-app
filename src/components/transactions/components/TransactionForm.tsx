
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
import { TaxReserveSuggestion } from '../TaxReserveSuggestion';

interface TransactionFormProps {
  onSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { form, isSubmitting, handleSubmit, taxSuggestion, dismissTaxSuggestion } = useTransactionForm(onSuccess);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col">
      <Form {...form}>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-5">
            <TransactionTypeSelector 
              value={form.watch('type')} 
              onValueChange={(value) => form.setValue('type', value)}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput 
                name="amount"
                control={form.control}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('transactions.category', 'Categoria')}
                    </FormLabel>
                    <FormControl>
                      <CategorySelector 
                        value={field.value} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('transactions.date', 'Data')}
                    </FormLabel>
                    <FormControl>
                      <TransactionDatePicker 
                        date={field.value} 
                        onDateChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('transactions.description', 'Descrição')} 
                      <span className="text-gray-400 ml-1 font-normal">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('transactions.descriptionPlaceholder', 'Ex: Supermercado')} 
                        {...field} 
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-6 gap-3 border-t mt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none min-w-[140px] h-10"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.saving', 'Salvando...')}
                </span>
              ) : (
                t('common.save', 'Salvar')
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>

      {/* M4: Sugestão de Reserva de Impostos */}
      {taxSuggestion.show && (
        <TaxReserveSuggestion
          amount={taxSuggestion.amount}
          percentage={taxSuggestion.percentage}
          onDismiss={dismissTaxSuggestion}
        />
      )}
    </div>
  );
};

export default TransactionForm;
