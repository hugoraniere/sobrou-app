
import React, { useState, useEffect } from 'react';
import { Ingredient } from '@/types/restaurant-calculator';
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from '@/services/restaurant-calculator/ingredientService';
import IngredientCard from './IngredientCard';
import IngredientForm from './IngredientForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const data = await getIngredients();
      setIngredients(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleAddIngredient = async (data: Omit<Ingredient, 'id'>) => {
    setIsLoading(true);
    try {
      const newIngredient = await createIngredient(data);
      if (newIngredient) {
        setIngredients([...ingredients, newIngredient]);
        setIsDialogOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDialogOpen(true);
  };

  const handleUpdateIngredient = async (data: Omit<Ingredient, 'id'>) => {
    if (!selectedIngredient) return;
    
    setIsLoading(true);
    try {
      const updatedIngredient = await updateIngredient(selectedIngredient.id, data);
      if (updatedIngredient) {
        setIngredients(
          ingredients.map(item => item.id === updatedIngredient.id ? updatedIngredient : item)
        );
        setIsDialogOpen(false);
        setSelectedIngredient(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteIngredient(id);
      if (success) {
        setIngredients(ingredients.filter(item => item.id !== id));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedIngredient(null);
  };

  const filteredIngredients = ingredients.filter(
    ingredient => ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">Lista de Ingredientes</TabsTrigger>
            <TabsTrigger value="add">Adicionar Ingrediente</TabsTrigger>
          </TabsList>
          
          {activeTab === 'list' && (
            <div className="mt-4 md:mt-0 relative flex items-center w-full md:w-64">
              <Search className="absolute left-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar ingredientes..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <TabsContent value="list">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} />
              ))}
            </div>
          ) : filteredIngredients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Nenhum ingrediente encontrado.</p>
              <Button onClick={() => setActiveTab('add')}>
                <Plus size={16} className="mr-1" /> Adicionar Ingrediente
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredIngredients.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  onEdit={handleEditIngredient}
                  onDelete={handleDeleteIngredient}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-medium mb-4">Adicionar Novo Ingrediente</h3>
            <IngredientForm 
              onSubmit={handleAddIngredient} 
              isLoading={isLoading}
              onCancel={() => setActiveTab('list')}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ingrediente</DialogTitle>
          </DialogHeader>
          {selectedIngredient && (
            <IngredientForm
              ingredient={selectedIngredient}
              onSubmit={handleUpdateIngredient}
              isLoading={isLoading}
              onCancel={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Card = () => (
  <div className="border rounded-md p-4">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-1" />
    <Skeleton className="h-4 w-1/3 mb-4" />
    <div className="flex justify-between">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export default IngredientsList;
