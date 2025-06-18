
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateBillData } from '@/types/bills';

const billSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  due_date: z.string().min(1, 'Data de vencimento é obrigatória'),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type BillFormData = z.infer<typeof billSchema>;

interface BillFormProps {
  onSubmit: (data: CreateBillData) => void;
  onCancel: () => void;
  initialData?: Partial<CreateBillData>;
  isSubmitting?: boolean;
}

export const BillForm: React.FC<BillFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}) => {
  const [isRecurring, setIsRecurring] = useState(initialData?.is_recurring || false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
    initialData?.recurrence_frequency || 'monthly'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount?.toString() || '',
      due_date: initialData?.due_date || '',
      description: initialData?.description || '',
      notes: initialData?.notes || '',
    },
  });

  const onFormSubmit = (data: BillFormData) => {
    onSubmit({
      title: data.title,
      amount: parseFloat(data.amount),
      due_date: data.due_date,
      description: data.description || undefined,
      notes: data.notes || undefined,
      is_recurring: isRecurring,
      recurrence_frequency: isRecurring ? recurrenceFrequency : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Ex: Conta de luz, Aluguel..."
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="due_date">Data de vencimento *</Label>
          <Input
            id="due_date"
            type="date"
            {...register('due_date')}
            className={errors.due_date ? 'border-red-500' : ''}
          />
          {errors.due_date && (
            <p className="text-sm text-red-500">{errors.due_date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Informações adicionais sobre a conta..."
          {...register('description')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Notas importantes, lembretes..."
          rows={3}
          {...register('notes')}
        />
      </div>

      {/* Controles de Recorrência */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="is-recurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
          <Label htmlFor="is-recurring">Conta Recorrente</Label>
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <Label>Frequência de Repetição</Label>
            <Select value={recurrenceFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setRecurrenceFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diária</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              A próxima conta será criada automaticamente após marcar esta como paga.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};
