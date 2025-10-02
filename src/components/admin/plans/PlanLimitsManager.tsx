import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Plus, Infinity } from 'lucide-react';

interface PlanLimit {
  id?: string;
  plan_id: string;
  feature_key: string;
  limit_value: number | null;
  limit_type: string;
}

interface Plan {
  id: string;
  name: string;
}

interface PlanLimitsManagerProps {
  onLimitsChange?: () => void;
}

const FEATURE_KEYS = [
  'transactions',
  'ai_messages', 
  'exports',
  'bills',
  'shopping_lists',
  'ai_parser',
  'custom_categories',
  'multiple_accounts',
  'api_access',
  'priority_support'
];

const FEATURE_NAMES: Record<string, string> = {
  'transactions': 'Transações',
  'ai_messages': 'Mensagens IA',
  'exports': 'Exportações',
  'bills': 'Contas a Pagar',
  'shopping_lists': 'Listas de Compras',
  'ai_parser': 'Parser de IA',
  'custom_categories': 'Categorias Personalizadas',
  'multiple_accounts': 'Múltiplas Contas',
  'api_access': 'Acesso API',
  'priority_support': 'Suporte Prioritário'
};

const PlanLimitsManager: React.FC<PlanLimitsManagerProps> = ({ onLimitsChange }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [limits, setLimits] = useState<Record<string, PlanLimit[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    fetchPlansAndLimits();
  }, []);

  const fetchPlansAndLimits = async () => {
    try {
      // Fetch plans
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('id, name')
        .eq('is_active', true);

      if (plansError) throw plansError;

      // Fetch limits
      const { data: limitsData, error: limitsError } = await supabase
        .from('plan_limits')
        .select('*');

      if (limitsError) throw limitsError;

      setPlans(plansData || []);

      // Group limits by plan
      const limitsMap: Record<string, PlanLimit[]> = {};
      plansData?.forEach(plan => {
        limitsMap[plan.id] = limitsData?.filter(limit => limit.plan_id === plan.id) || [];
      });

      setLimits(limitsMap);

      if (plansData && plansData.length > 0) {
        setSelectedPlan(plansData[0].id);
      }
    } catch (error) {
      console.error('Error fetching plans and limits:', error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const updateLimit = (planId: string, featureKey: string, field: keyof PlanLimit, value: any) => {
    setLimits(prev => {
      const planLimits = [...(prev[planId] || [])];
      const existingLimitIndex = planLimits.findIndex(l => l.feature_key === featureKey);
      
      if (existingLimitIndex >= 0) {
        planLimits[existingLimitIndex] = {
          ...planLimits[existingLimitIndex],
          [field]: value
        };
      } else {
        planLimits.push({
          plan_id: planId,
          feature_key: featureKey,
          limit_value: field === 'limit_value' ? value : null,
          limit_type: field === 'limit_type' ? value : 'count',
          [field]: value
        });
      }
      
      return { ...prev, [planId]: planLimits };
    });
  };

  const getLimit = (planId: string, featureKey: string): PlanLimit | null => {
    const planLimits = limits[planId] || [];
    return planLimits.find(l => l.feature_key === featureKey) || null;
  };

  const addFeatureToAllPlans = (featureKey: string) => {
    plans.forEach(plan => {
      if (!getLimit(plan.id, featureKey)) {
        updateLimit(plan.id, featureKey, 'feature_key', featureKey);
        updateLimit(plan.id, featureKey, 'limit_type', 'count');
        updateLimit(plan.id, featureKey, 'limit_value', 0);
      }
    });
  };

  const saveLimits = async () => {
    setSaving(true);
    try {
      // Prepare all limits for upsert
      const allLimits = Object.values(limits).flat().filter(limit => 
        limit.feature_key && limit.plan_id
      );

      const upsertPromises = allLimits.map(limit => 
        supabase
          .from('plan_limits')
          .upsert({
            plan_id: limit.plan_id,
            feature_key: limit.feature_key,
            limit_value: limit.limit_value,
            limit_type: limit.limit_type
          }, {
            onConflict: 'plan_id,feature_key'
          })
      );

      await Promise.all(upsertPromises);

      toast.success("Limites salvos com sucesso");

      onLimitsChange?.();
      await fetchPlansAndLimits();
    } catch (error) {
      console.error('Error saving limits:', error);
      toast.error("Erro ao salvar as configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedPlanLimits = limits[selectedPlan] || [];
  const availableFeatures = FEATURE_KEYS.filter(key => 
    !selectedPlanLimits.some(limit => limit.feature_key === key)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gerenciamento de Limites</h3>
        <Button onClick={saveLimits} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Limites por Plano</CardTitle>
          <div className="flex gap-4 items-center">
            <Label>Plano:</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPlanLimits.map(limit => {
            const featureName = FEATURE_NAMES[limit.feature_key] || limit.feature_key;
            
            return (
              <div key={limit.feature_key} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Label className="font-medium">{featureName}</Label>
                  <p className="text-sm text-muted-foreground">{limit.feature_key}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={limit.limit_value !== 0}
                    onCheckedChange={(checked) => {
                      updateLimit(selectedPlan, limit.feature_key, 'limit_value', checked ? null : 0);
                    }}
                  />
                  <Label className="text-sm">Ativado</Label>
                </div>

                <div className="flex items-center gap-2 min-w-32">
                  {limit.limit_value === null ? (
                    <Badge variant="secondary">
                      <Infinity className="h-3 w-3 mr-1" />
                      Ilimitado
                    </Badge>
                  ) : limit.limit_value === 0 ? (
                    <Badge variant="destructive">Bloqueado</Badge>
                  ) : (
                    <Input
                      type="number"
                      value={limit.limit_value || ''}
                      onChange={(e) => 
                        updateLimit(selectedPlan, limit.feature_key, 'limit_value', 
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-20"
                      min="1"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {availableFeatures.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Adicionar Funcionalidade:</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {availableFeatures.map(feature_key => (
                  <Button
                    key={feature_key}
                    variant="outline"
                    size="sm"
                    onClick={() => addFeatureToAllPlans(feature_key)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {FEATURE_NAMES[feature_key] || feature_key}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanLimitsManager;