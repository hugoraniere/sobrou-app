import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlanFeature {
  name: string;
  enabled: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_cycle: string;
  features: PlanFeature[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
  { value: 'one_time', label: 'Pagamento Único' }
];

const DEFAULT_FEATURES = [
  'Transações',
  'Análises básicas',
  'Análises avançadas',
  'Metas de economia',
  'Chat IA',
  'Relatórios personalizados',
  'WhatsApp Premium',
  'Suporte prioritário',
  'API access',
  'Múltiplas contas'
];

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    billing_cycle: 'monthly',
    features: DEFAULT_FEATURES.map(name => ({ name, enabled: false, limit: '' })),
    is_active: true,
    is_featured: false,
    display_order: 0
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPlans((data as unknown as Plan[]) || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error("Falha ao carregar planos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const planData = {
        ...formData,
        features: formData.features.filter(f => f.enabled)
      };

      if (selectedPlan) {
        const { error } = await supabase
          .from('plans')
          .update(planData)
          .eq('id', selectedPlan.id);

        if (error) throw error;
        toast.success("Plano atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('plans')
          .insert([planData]);

        if (error) throw error;
        toast.success("Plano criado com sucesso!");
      }

      setIsDialogOpen(false);
      setSelectedPlan(null);
      resetForm();
      await fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error("Falha ao salvar plano");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      toast.success("Plano excluído com sucesso!");
      await fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error("Falha ao excluir plano");
    }
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    const allFeatures = [...DEFAULT_FEATURES];
    
    // Add existing features that might not be in defaults
    plan.features.forEach(feature => {
      if (!allFeatures.includes(feature.name)) {
        allFeatures.push(feature.name);
      }
    });

    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      features: allFeatures.map(name => {
        const existingFeature = plan.features.find(f => f.name === name);
        return {
          name,
          enabled: !!existingFeature,
          limit: existingFeature?.limit || ''
        };
      }),
      is_active: plan.is_active,
      is_featured: plan.is_featured,
      display_order: plan.display_order
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'BRL',
      billing_cycle: 'monthly',
      features: DEFAULT_FEATURES.map(name => ({ name, enabled: false, limit: '' })),
      is_active: true,
      is_featured: false,
      display_order: plans.length
    });
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const updateFeature = (index: number, field: keyof PlanFeature, value: any) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  if (isLoading && plans.length === 0) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
        <main className="w-full px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Planos</h1>
            <p className="text-muted-foreground">
              Configure os planos de assinatura disponíveis para os usuários
            </p>
          </div>
          <Button onClick={handleNewPlan} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Plano
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.is_featured ? 'ring-2 ring-primary' : ''}`}>
              {plan.is_featured && (
                <Badge className="absolute -top-2 -right-2 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Destaque
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  {plan.price > 0 ? (
                    <>
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.billing_cycle === 'monthly' ? 'mês' : 
                          plan.billing_cycle === 'yearly' ? 'ano' : 'única'}
                      </span>
                    </>
                  ) : (
                    'Gratuito'
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-sm">Funcionalidades:</h4>
                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{feature.name}</span>
                        {feature.limit && (
                          <Badge variant="outline" className="text-xs">
                            {feature.limit}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPlan ? 'Editar Plano' : 'Novo Plano'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações e funcionalidades do plano
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Plano</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Plano Pro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_cycle">Ciclo de Cobrança</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, billing_cycle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_CYCLES.map(cycle => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do plano..."
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Label>Funcionalidades</Label>
                <div className="space-y-3 max-h-40 overflow-y-auto border rounded-md p-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(checked) => updateFeature(index, 'enabled', checked)}
                      />
                      <span className="flex-1 text-sm">{feature.name}</span>
                      {feature.enabled && (
                        <Input
                          placeholder="Limite (opcional)"
                          value={feature.limit}
                          onChange={(e) => updateFeature(index, 'limit', e.target.value)}
                          className="w-32 text-xs"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Plano Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label>Plano Destacado</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {selectedPlan ? 'Atualizar' : 'Criar'} Plano
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminPlans;