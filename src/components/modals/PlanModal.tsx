import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
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
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal = ({ isOpen, onClose }: PlanModalProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
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

  const handleSubscribe = (plan: Plan) => {
    // TODO: Implement subscription logic here
    toast.success(`A assinatura do plano ${plan.name} será implementada em breve!`);
  };

  const formatPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Gratuito';
    
    const suffix = plan.billing_cycle === 'monthly' ? '/mês' : 
                   plan.billing_cycle === 'yearly' ? '/ano' : '';
    
    return `R$ ${plan.price.toFixed(2)}${suffix}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Escolha seu Plano
          </DialogTitle>
          <DialogDescription className="text-center">
            Desbloqueie todo o potencial do Sobrou com nossos planos premium
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  plan.is_featured ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.is_featured && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 px-3 py-1">
                    <Star className="h-3 w-3" />
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(plan)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm">{feature.name}</span>
                          {feature.limit && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {feature.limit}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={plan.is_featured ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              ✨ Todas as assinaturas incluem suporte técnico e atualizações gratuitas
            </div>
            <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;