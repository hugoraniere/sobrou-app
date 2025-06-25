
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

import IngredientsList from '@/components/restaurant-calculator/ingredients/IngredientsList';
import DishesList from '@/components/restaurant-calculator/dishes/DishesList';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantCalculator, DishFormStep } from '@/hooks/useRestaurantCalculator';
import { deleteDish } from '@/services/restaurant-calculator/dishService';
import DishFormDialog from '@/components/restaurant-calculator/DishFormDialog';
import IngredientDialog from '@/components/restaurant-calculator/IngredientDialog';

const RestaurantCalculator: React.FC = () => {
  const { user } = useAuth();
  const {
    currentTab,
    setCurrentTab,
    isDishFormOpen,
    setIsDishFormOpen,
    dishFormStep,
    selectedDish,
    dishIngredients,
    isLoading,
    calculation,
    isIngredientDialogOpen,
    setIsIngredientDialogOpen,
    isDuplicating,
    handleCreateDish,
    handleEditDish,
    handleDuplicateDish,
    handleCalculateDish,
    handleDishFormSubmit,
    handleAddDishIngredient,
    handleUpdateDishIngredient,
    handleRemoveDishIngredient,
    handleFinishIngredientsStep,
    setDishFormStep,
  } = useRestaurantCalculator();

  const handleDeleteDish = async (id: string) => {
    if (isLoading) return;
    
    const success = await deleteDish(id);
    if (success) {
      setCurrentTab('dishes'); // Volta para a lista de pratos
    }
  };

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <ResponsivePageContainer>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-2">Login Necessário</h1>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar a calculadora de gastos para restaurantes.
            </p>
            <Button asChild>
              <a href="/auth">Fazer Login</a>
            </Button>
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader 
        title="Calculadora de Gastos para Restaurantes"
        description="Cadastre seus ingredientes, crie pratos e calcule automaticamente custos e preços."
      />

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          <TabsTrigger value="dishes">Pratos</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="ingredients">
            <Card className="p-6">
              <IngredientsList />
            </Card>
          </TabsContent>
          
          <TabsContent value="dishes">
            <Card className="p-6">
              <DishesList
                onCreateDish={handleCreateDish}
                onEditDish={handleEditDish}
                onDeleteDish={handleDeleteDish}
                onDuplicateDish={handleDuplicateDish}
                onCalculateDish={handleCalculateDish}
                onCreateIngredient={() => setIsIngredientDialogOpen(true)}
              />
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Modal para criação/edição de pratos */}
      <DishFormDialog
        open={isDishFormOpen}
        onOpenChange={setIsDishFormOpen}
        dishFormStep={dishFormStep}
        selectedDish={selectedDish}
        isDuplicating={isDuplicating}
        dishIngredients={dishIngredients}
        calculation={calculation}
        isLoading={isLoading}
        onDishFormSubmit={handleDishFormSubmit}
        onAddDishIngredient={handleAddDishIngredient}
        onUpdateDishIngredient={handleUpdateDishIngredient}
        onRemoveDishIngredient={handleRemoveDishIngredient}
        onFinishIngredientsStep={handleFinishIngredientsStep}
        setDishFormStep={setDishFormStep}
        onOpenIngredientDialog={() => setIsIngredientDialogOpen(true)}
      />

      {/* Dialog para adicionar novo ingrediente diretamente */}
      <IngredientDialog
        open={isIngredientDialogOpen}
        onOpenChange={setIsIngredientDialogOpen}
      />
    </ResponsivePageContainer>
  );
};

export default RestaurantCalculator;
