
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import CategorySelector from '@/components/prompt/CategorySelector';
import TransactionDatePicker from '@/components/prompt/TransactionDatePicker';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CurrencyInput from './CurrencyInput';
import TransactionTypeSelector from './TransactionTypeSelector';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { TaxReserveSuggestion } from '../TaxReserveSuggestion';
import { PaymentMethodSelect } from '../PaymentMethodSelect';
import { StatusRadioGroup } from '../StatusRadioGroup';
import { TagsInput } from '../TagsInput';

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

            {/* M3: Campos MEI */}
            <Separator className="my-4" />
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Informações MEI (opcional)</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="competence_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Data de Competência
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
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Forma de Pagamento
                      </FormLabel>
                      <FormControl>
                        <PaymentMethodSelect 
                          value={field.value || ''} 
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Status
                    </FormLabel>
                    <FormControl>
                      <StatusRadioGroup 
                        value={field.value || 'paid'} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Cliente/Fornecedor
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: João Silva" 
                          {...field} 
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Projeto
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Projeto XYZ" 
                          {...field} 
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Tags
                    </FormLabel>
                    <FormControl>
                      <TagsInput 
                        value={field.value || []} 
                        onChange={field.onChange}
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
