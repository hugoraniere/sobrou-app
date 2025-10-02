import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  PowerOff, 
  Eye,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { ProductTourService } from '@/services/productTourService';
import { ProductTourStep } from '@/types/product-tour';
import { toast } from 'sonner';
import ProductTourStepEditor from './ProductTourStepEditor';

interface TourConfig {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  version: string;
  steps: ProductTourStep[];
}

const ProductTourAdmin: React.FC = () => {
  const [tours, setTours] = useState<TourConfig[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setIsLoading(true);
      const steps = await ProductTourService.getTourSteps();
      
      // Group steps by tour (for now we'll have one default tour)
      const defaultTour: TourConfig = {
        id: 'default',
        name: 'Tour Principal',
        description: 'Tour introdutório das funcionalidades principais',
        is_active: true,
        version: '1.0',
        steps: steps
      };

      setTours([defaultTour]);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Erro ao carregar tours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTour = async (tourId: string, isActive: boolean) => {
    try {
      // For now, we'll update the tour config in settings
      await ProductTourService.updateTourConfig({ enabled: isActive });
      
      setTours(prev => prev.map(tour => 
        tour.id === tourId ? { ...tour, is_active: isActive } : tour
      ));

      toast.success(isActive ? 'Tour ativado' : 'Tour desativado');
    } catch (error) {
      console.error('Error toggling tour:', error);
      toast.error('Erro ao atualizar tour');
    }
  };

  const handleEditTour = (tour: TourConfig) => {
    setSelectedTour(tour);
    setIsEditing(true);
  };

  const handleSaveTour = async (updatedSteps: ProductTourStep[]) => {
    try {
      // Save individual steps
      for (const step of updatedSteps) {
        await ProductTourService.updateTourStep(step.id, step);
      }

      await loadTours();
      setIsEditing(false);
      setSelectedTour(null);
      toast.success('Tour atualizado com sucesso');
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Erro ao salvar tour');
    }
  };

  const handlePreviewTour = async (tour: TourConfig) => {
    try {
      // Start tour preview
      toast.info('Iniciando preview do tour...');
      // Here we would integrate with the ProductTourProvider to start the tour
    } catch (error) {
      console.error('Error previewing tour:', error);
      toast.error('Erro ao visualizar tour');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-text-secondary">Carregando tours...</div>
      </div>
    );
  }

  if (isEditing && selectedTour) {
    return (
      <ProductTourStepEditor
        tour={selectedTour}
        onSave={handleSaveTour}
        onCancel={() => {
          setIsEditing(false);
          setSelectedTour(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Product Tours</h2>
          <p className="text-text-secondary mt-1">
            Gerencie as experiências de tour do produto
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Tour
        </Button>
      </div>

      <div className="grid gap-4">
        {tours.map((tour) => (
          <Card key={tour.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tour.name}</CardTitle>
                    <p className="text-sm text-text-secondary">{tour.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tour.is_active ? "default" : "secondary"}>
                    {tour.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Switch
                    checked={tour.is_active}
                    onCheckedChange={(checked) => handleToggleTour(tour.id, checked)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    {tour.steps.length} passos
                  </span>
                  <span>Versão {tour.version}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewTour(tour)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTour(tour)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-text-primary">Passos do Tour:</h4>
                <div className="grid gap-2">
                  {tour.steps.slice(0, 3).map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 p-2 bg-surface-secondary rounded-lg text-sm"
                    >
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{step.title}</span>
                        <span className="text-text-secondary ml-2">• {step.page_route}</span>
                      </div>
                      <Badge variant={step.is_active ? "default" : "secondary"} className="text-xs">
                        {step.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  ))}
                  {tour.steps.length > 3 && (
                    <div className="text-xs text-text-secondary text-center py-1">
                      +{tour.steps.length - 3} passos adicionais
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tours.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum tour criado
          </h3>
          <p className="text-text-secondary mb-4">
            Crie seu primeiro product tour para guiar os usuários
          </p>
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Primeiro Tour
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProductTourAdmin;