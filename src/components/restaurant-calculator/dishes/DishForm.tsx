
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dish } from '@/types/restaurant-calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'Nome do prato é obrigatório'),
  description: z.string().optional(),
  operational_cost_percentage: z.coerce.number().min(0, 'Percentual não pode ser negativo'),
  tax_percentage: z.coerce.number().min(0, 'Percentual não pode ser negativo').optional(),
  desired_margin_percentage: z.coerce.number().min(0, 'Margem não pode ser negativa').max(99.9, 'Margem deve ser menor que 100%'),
  selling_price: z.coerce.number().positive('Preço deve ser maior que zero').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DishFormProps {
  dish?: Dish;
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const DishForm: React.FC<DishFormProps> = ({ 
  dish, 
  onSubmit, 
  isLoading = false,
  onCancel
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dish?.name || '',
      description: dish?.description || '',
      operational_cost_percentage: dish?.operational_cost_percentage || 30,
      tax_percentage: dish?.tax_percentage || 0,
      desired_margin_percentage: dish?.desired_margin_percentage || 65,
      selling_price: dish?.selling_price || undefined,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Prato</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Risoto de Cogumelos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o prato, especificações, etc."
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="operational_cost_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custos Operacionais (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" step="0.1" min="0" {...field} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impostos (%) - opcional</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" step="0.1" min="0" {...field} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="desired_margin_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Margem Desejada (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" step="0.1" min="0" max="99.9" {...field} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="selling_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda Desejado (opcional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      className="pl-8"
                      {...field} 
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : dish ? 'Atualizar Prato' : 'Continuar para Ingredientes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DishForm;
