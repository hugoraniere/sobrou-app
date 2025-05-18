
import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ingredient, DishIngredient } from '@/types/restaurant-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getIngredients } from '@/services/restaurant-calculator/ingredientService';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IngredientSelectorProps {
  dishIngredients: (DishIngredient & { ingredient: Ingredient })[];
  onAddIngredient: (ingredientId: string, quantity: number) => void;
  onUpdateQuantity: (dishIngredientId: string, quantity: number) => void;
  onRemoveIngredient: (dishIngredientId: string) => void;
  onAddNewClick?: () => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  dishIngredients,
  onAddIngredient,
  onUpdateQuantity,
  onRemoveIngredient,
  onAddNewClick
}) => {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true);
      try {
        const data = await getIngredients();
        setIngredients(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, []);

  const handleAddIngredient = () => {
    if (selectedId && quantity > 0) {
      onAddIngredient(selectedId, quantity);
      setSelectedId(null);
      setQuantity(0);
      setOpen(false);
    }
  };

  // Filtrar ingredientes que ainda não foram adicionados ao prato
  const availableIngredients = ingredients.filter(
    ingredient => !dishIngredients.some(di => di.ingredient_id === ingredient.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ingredientes do Prato</h3>
        <div className="flex space-x-2">
          {onAddNewClick && (
            <Button variant="outline" size="sm" onClick={onAddNewClick}>
              <Plus className="mr-1 h-4 w-4" />
              Novo Ingrediente
            </Button>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Adicionar Ingrediente
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
              <Command>
                <CommandInput placeholder="Buscar ingrediente..." />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? 'Carregando...' : 'Nenhum ingrediente encontrado.'}
                  </CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {availableIngredients.map((ingredient) => (
                        <CommandItem
                          key={ingredient.id}
                          value={ingredient.name}
                          onSelect={() => {
                            setSelectedId(ingredient.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedId === ingredient.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {ingredient.name}
                          <Badge variant="outline" className="ml-2">
                            {ingredient.unit}
                          </Badge>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
                <Separator />
                <div className="p-4">
                  <div className="space-y-2">
                    <Label>Quantidade:</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Quantidade"
                      />
                      <Button 
                        variant="secondary" 
                        onClick={handleAddIngredient}
                        disabled={!selectedId || quantity <= 0}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {dishIngredients.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-6 text-center">
          <p className="text-gray-500">Nenhum ingrediente adicionado ao prato ainda.</p>
          <p className="text-gray-500 text-sm mt-1">
            Use o botão acima para adicionar ingredientes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dishIngredients.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div>
                <div className="font-medium">{item.ingredient.name}</div>
                <div className="text-xs text-gray-500">
                  R$ {item.ingredient.price.toFixed(2)} / {item.ingredient.unit}
                  {item.ingredient.waste_percentage > 0 && ` • ${item.ingredient.waste_percentage}% de merma`}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-24">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {item.ingredient.unit}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onRemoveIngredient(item.id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;
