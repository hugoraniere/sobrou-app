
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateBillTransactionData } from '@/types/billTransactions';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório'),
  type: z.enum(['debit', 'credit'], { required_error: 'Tipo é obrigatório' }),
  description: z.string().optional(),
  transaction_date: z.string().min(1, 'Data é obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  billId: string;
  onSubmit: (data: CreateBillTransactionData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  billId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const transactionType = watch('type');

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      bill_id: billId,
      amount: parseFloat(data.amount),
      type: data.type,
      description: data.description || '',
      transaction_date: data.transaction_date,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Transação *</Label>
          <Select onValueChange={(value: 'debit' | 'credit') => setValue('type', value)}>
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">Pagamento (Débito)</SelectItem>
              <SelectItem value="credit">Acréscimo (Crédito)</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('amount')}
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction_date">Data da Transação *</Label>
        <Input
          id="transaction_date"
          type="date"
          {...register('transaction_date')}
          className={errors.transaction_date ? 'border-red-500' : ''}
        />
        {errors.transaction_date && (
          <p className="text-sm text-red-500">{errors.transaction_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-gray-400 ml-1 font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder={
            transactionType === 'debit' 
              ? "Ex: Pagamento parcial, PIX..." 
              : "Ex: Juros, multa, taxa adicional..."
          }
          rows={3}
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Salvando...' : 'Adicionar Transação'}
        </Button>
      </div>
    </form>
  );
};
