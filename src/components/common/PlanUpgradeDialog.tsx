import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Check, Crown, Zap, X } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  description: string;
  features: any;
  is_featured: boolean;
}

interface PlanUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureBlocked?: string;
  currentPlan?: string;
  onPlanSelect?: (planId: string) => void;
}

const PlanUpgradeDialog: React.FC<PlanUpgradeDialogProps> = ({
  open,
  onOpenChange,
  featureBlocked,
  currentPlan = 'Gratuito',
  onPlanSelect
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, cycle: string) => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toFixed(2)}/${cycle === 'monthly' ? 'mês' : 'ano'}`;
  };

  const getPlanFeatures = (planFeatures: any) => {
    if (typeof planFeatures === 'string') {
      try {
        return JSON.parse(planFeatures);
      } catch {
        return [];
      }
    }
    return Array.isArray(planFeatures) ? planFeatures : [];
  };

  const handleSelectPlan = (planId: string) => {
    onPlanSelect?.(planId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            {featureBlocked ? 'Upgrade Necessário' : 'Escolha seu Plano'}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {featureBlocked 
              ? `Para usar ${featureBlocked}, você precisa fazer upgrade do seu plano.`
              : 'Desbloqueie todo o potencial do Sobrou com funcionalidades premium.'
            }
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {plans.map((plan, index) => {
              const isCurrentPlan = plan.name.toLowerCase() === currentPlan.toLowerCase();
              const features = getPlanFeatures(plan.features);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.is_featured ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'bg-muted' : ''}`}
                >
                  {plan.is_featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="text-2xl font-bold text-primary mt-2">
                        {formatPrice(plan.price, plan.billing_cycle)}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      {features.map((feature: any, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          {feature.enabled ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {feature.name}
                            {feature.limit && feature.enabled && (
                              <span className="text-muted-foreground ml-1">
                                ({feature.limit})
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Plano Atual
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${plan.is_featured ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}`}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.price === 0 ? 'Continuar Gratuito' : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Fazer Upgrade
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>Cancele a qualquer momento • Suporte 24/7 • Sem taxas ocultas</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeDialog;