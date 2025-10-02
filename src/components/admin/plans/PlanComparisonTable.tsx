import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Copy, Edit, Users } from 'lucide-react';
import { FEATURE_MODULES, getFeatureById } from '@/constants/planFeatures';

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
}

interface PlanComparisonTableProps {
  plans: Plan[];
  onEditPlan: (plan: Plan) => void;
  onDuplicatePlan: (plan: Plan) => void;
  onViewUsers: (plan: Plan) => void;
}

const PlanComparisonTable: React.FC<PlanComparisonTableProps> = ({
  plans,
  onEditPlan,
  onDuplicatePlan,
  onViewUsers
}) => {
  // Get all unique features from all plans
  const allFeatureIds = new Set<string>();
  plans.forEach(plan => {
    plan.features.forEach(feature => {
      if (typeof feature === 'object' && feature.id) {
        allFeatureIds.add(feature.id);
      } else if (typeof feature === 'string') {
        // Handle legacy feature format
        allFeatureIds.add(feature);
      }
    });
  });

  const formatPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Gratuito';
    
    const cycleText = {
      'monthly': '/mês',
      'yearly': '/ano', 
      'one_time': ' única'
    }[plan.billing_cycle] || '';

    return `${plan.currency} ${plan.price.toFixed(2)}${cycleText}`;
  };

  const hasFeature = (plan: Plan, featureId: string) => {
    return plan.features.some(feature => {
      if (typeof feature === 'object') {
        return feature.id === featureId || feature.name === featureId;
      }
      return feature === featureId;
    });
  };

  const getFeatureLimit = (plan: Plan, featureId: string) => {
    const feature = plan.features.find(f => {
      if (typeof f === 'object') {
        return f.id === featureId || f.name === featureId;
      }
      return f === featureId;
    });
    
    return typeof feature === 'object' ? feature.limit : null;
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Nenhum plano criado ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comparação de Planos</h3>
        <Badge variant="outline">
          {plans.length} plano{plans.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto">
        {/* Plans Header */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length + 1, 4)} gap-4`}>
          <div className="hidden md:block">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm">Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Compare as funcionalidades disponíveis em cada plano
                </div>
              </CardContent>
            </Card>
          </div>

          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.is_featured ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex gap-1">
                    <Badge variant={plan.is_active ? "default" : "secondary"} className="text-xs">
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {plan.is_featured && (
                      <Badge className="text-xs">Destaque</Badge>
                    )}
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {formatPrice(plan)}
                </div>
                {plan.description && (
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditPlan(plan)}
                    className="w-full"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDuplicatePlan(plan)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewUsers(plan)}
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

        {/* Features Comparison */}
        <div className="space-y-4">
          {FEATURE_MODULES.map((module) => (
            <Card key={module.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{module.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {module.features.length} funcionalidades
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.features.map((feature) => (
                    <div key={feature.id} className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length + 1, 4)} gap-4 py-2 border-b border-border/50 last:border-0`}>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{feature.name}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                      
                      {plans.map((plan) => {
                        const hasThisFeature = hasFeature(plan, feature.id);
                        const limit = getFeatureLimit(plan, feature.id);
                        
                        return (
                          <div key={`${plan.id}-${feature.id}`} className="flex items-center justify-center py-1">
                            {hasThisFeature ? (
                              <div className="flex flex-col items-center gap-1">
                                <Check className="h-4 w-4 text-green-600" />
                                {limit && (
                                  <Badge variant="outline" className="text-xs">
                                    {limit}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonTable;