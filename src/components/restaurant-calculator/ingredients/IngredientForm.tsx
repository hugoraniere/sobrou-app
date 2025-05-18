
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ingredient, Unit } from '@/types/restaurant-calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from 'sonner';

const unitOptions: { label: string; value: Unit }[] = [
  { label: 'Gramas (g)', value: 'g' },
  { label: 'Quilogramas (kg)', value: 'kg' },
  { label: 'Mililitros (ml)', value: 'ml' },
  { label: 'Litros (L)', value: 'L' },
  { label: 'Unidades (un)', value: 'un' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  unit: z.enum(['g', 'kg', 'ml', 'L', 'un']),
  quantity_purchased: z.coerce.number().positive('Quantidade deve ser maior que zero').optional(),
  total_price: z.coerce.number().positive('Preço deve ser maior que zero').optional(),
  price: z.coerce.number().positive('Preço unitário deve ser maior que zero'),
  waste_percentage: z.coerce.number().min(0, 'Merma não pode ser negativa').max(100, 'Merma não pode ser maior que 100%'),
});

type FormValues = z.infer<typeof formSchema>;

interface IngredientFormProps {
  ingredient?: Ingredient;
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ 
  ingredient, 
  onSubmit, 
  isLoading = false,
  onCancel
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ingredient?.name || '',
      unit: ingredient?.unit || 'g',
      quantity_purchased: ingredient?.quantity_purchased || undefined,
      total_price: ingredient?.total_price || undefined,
      price: ingredient?.price || 0,
      waste_percentage: ingredient?.waste_percentage || 0,
    },
  });

  // Calcular automaticamente o preço unitário quando a quantidade ou preço total mudar
  const watchQuantity = form.watch('quantity_purchased');
  const watchTotalPrice = form.watch('total_price');
  
  useEffect(() => {
    if (watchQuantity && watchTotalPrice && watchQuantity > 0) {
      const unitPrice = watchTotalPrice / watchQuantity;
      form.setValue('price', unitPrice);
    }
  }, [watchQuantity, watchTotalPrice, form]);

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
              <FormLabel>Nome do Ingrediente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Farinha de Trigo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de Medida</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity_purchased"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Comprada ({form.watch('unit')})</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Total Pago (R$)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                    <Input type="number" step="0.01" min="0" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço por {form.watch('unit')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    className="pl-8" 
                    {...field} 
                    readOnly={!!watchQuantity && !!watchTotalPrice}
                    disabled={!!watchQuantity && !!watchTotalPrice}
                  />
                </div>
              </FormControl>
              {watchQuantity && watchTotalPrice && (
                <FormDescription>
                  Calculado automaticamente com base na quantidade e preço total.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waste_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>% de Merma (Desperdício)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="number" step="0.1" min="0" max="100" {...field} />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : ingredient ? 'Atualizar Ingrediente' : 'Adicionar Ingrediente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IngredientForm;
