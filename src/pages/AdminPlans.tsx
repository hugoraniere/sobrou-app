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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Star, Copy, Users, Shield, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import PlanFeatureManager from '@/components/admin/plans/PlanFeatureManager';
import PlanComparisonTable from '@/components/admin/plans/PlanComparisonTable';
import PlanUsersModal from '@/components/admin/plans/PlanUsersModal';
import { FEATURE_MODULES, getAllFeatures, USER_PERMISSIONS } from '@/constants/planFeatures';

interface PlanFeatureData {
  id: string;
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
  features: any[];
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

// Legacy features for backwards compatibility
const LEGACY_FEATURES = [
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
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedPlanForUsers, setSelectedPlanForUsers] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState('manage');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    billing_cycle: 'monthly',
    features: [] as PlanFeatureData[],
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
        features: formData.features.filter(f => f.enabled).map(f => ({
          id: f.id,
          enabled: f.enabled,
          limit: f.limit || null
        }))
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
    
    // Convert plan features to the new format
    const allFeatures = getAllFeatures();
    const planFeatureData: PlanFeatureData[] = allFeatures.map(feature => {
      const existingFeature = plan.features.find(f => 
        (typeof f === 'object' && (f.id === feature.id || f.name === feature.name)) ||
        (typeof f === 'string' && f === feature.name)
      );
      
      return {
        id: feature.id,
        enabled: !!existingFeature,
        limit: typeof existingFeature === 'object' ? existingFeature.limit || '' : ''
      };
    });

    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      features: planFeatureData,
      is_active: plan.is_active,
      is_featured: plan.is_featured,
      display_order: plan.display_order
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    const allFeatures = getAllFeatures();
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'BRL',
      billing_cycle: 'monthly',
      features: allFeatures.map(feature => ({ 
        id: feature.id, 
        enabled: false, 
        limit: '' 
      })),
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

  const handleFeatureChange = (featureId: string, enabled: boolean, limit?: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId
          ? { ...feature, enabled, limit: limit || '' }
          : feature
      )
    }));
  };

  const handleViewUsers = (plan: Plan) => {
    setSelectedPlanForUsers(plan);
    setIsUsersModalOpen(true);
  };

  const handleDuplicatePlan = (plan: Plan) => {
    const duplicatedPlan = {
      ...plan,
      name: `${plan.name} (Cópia)`,
      display_order: plans.length
    };
    delete (duplicatedPlan as any).id; // Remove ID so it creates a new plan
    
    handleEdit(duplicatedPlan as Plan);
    setSelectedPlan(null); // Clear selected plan so it creates new instead of updating
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
    <AdminPageLayout
      title="Administração de Planos"
      subtitle="Configure planos de assinatura e permissões de usuário"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Gerenciar Planos
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Comparar Planos
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissões vs Planos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Planos de Usuário</h2>
                <p className="text-sm text-muted-foreground">
                  Definem quais funcionalidades os usuários podem acessar baseado em sua assinatura
                </p>
              </div>
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
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>
                            {typeof feature === 'object' 
                              ? (feature.name || feature.id) 
                              : feature}
                          </span>
                          {typeof feature === 'object' && feature.limit && (
                            <Badge variant="outline" className="text-xs">
                              {feature.limit}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {plan.features.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          +{plan.features.length - 5} funcionalidades
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicatePlan(plan)}
                        className="flex-1"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicar
                      </Button>
                      <Button
                        variant="outline"  
                        size="sm"
                        onClick={() => handleViewUsers(plan)}
                        className="flex-1"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Usuários
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          <PlanComparisonTable
            plans={plans}
            onEditPlan={handleEdit}
            onDuplicatePlan={handleDuplicatePlan}
            onViewUsers={handleViewUsers}
          />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Planos de Usuário
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Controlam quais <strong>funcionalidades</strong> o usuário pode acessar baseado em sua assinatura
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {plan.features.length} funcionalidades
                      </div>
                    </div>
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Permissões de Sistema
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Controlam o <strong>nível de acesso</strong> do usuário às áreas administrativas
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {USER_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {permission.description}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        permission.level === 'admin' ? 'destructive' :
                        permission.level === 'support' ? 'default' :
                        permission.level === 'content' ? 'secondary' : 'outline'
                      }
                    >
                      {permission.level}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diferença Entre Planos e Permissões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Planos de Usuário
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Definem funcionalidades do produto</li>
                    <li>• Relacionados à monetização</li>
                    <li>• Controlam recursos como IA, exportação, etc.</li>
                    <li>• Usuário pode ter apenas 1 plano ativo</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissões de Sistema
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Definem acesso administrativo</li>
                    <li>• Relacionados à gestão do sistema</li>
                    <li>• Controlam áreas como blog, suporte, admin</li>
                    <li>• Usuário pode ter múltiplas permissões</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                <PlanFeatureManager
                  selectedFeatures={formData.features}
                  onFeatureChange={handleFeatureChange}
                />
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

        <PlanUsersModal
          plan={selectedPlanForUsers}
          isOpen={isUsersModalOpen}
          onClose={() => {
            setIsUsersModalOpen(false);
            setSelectedPlanForUsers(null);
          }}
        />
      </AdminPageLayout>
    );
  };

export default AdminPlans;