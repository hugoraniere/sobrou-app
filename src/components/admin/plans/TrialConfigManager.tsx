import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Save, Mail, Clock, Users, TrendingUp } from 'lucide-react';

interface TrialConfig {
  id?: string;
  trialDurationDays: number;
  trialPlanId: string | null;
  emailSequence: any[];
  isActive: boolean;
}

interface Plan {
  id: string;
  name: string;
}

interface TrialStats {
  totalTrials: number;
  activeTrials: number;
  conversions: number;
  conversionRate: number;
}

const TrialConfigManager: React.FC = () => {
  const [config, setConfig] = useState<TrialConfig>({
    trialDurationDays: 14,
    trialPlanId: null,
    emailSequence: [],
    isActive: true
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<TrialStats>({
    totalTrials: 0,
    activeTrials: 0,
    conversions: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch plans
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('id, name')
        .eq('is_active', true);

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch trial config
      const { data: configData, error: configError } = await supabase
        .from('trial_config')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (configError && configError.code !== 'PGRST116') throw configError;

      if (configData) {
        setConfig({
          id: configData.id,
          trialDurationDays: configData.trial_duration_days,
          trialPlanId: configData.trial_plan_id,
          emailSequence: Array.isArray(configData.email_sequence) ? configData.email_sequence : [],
          isActive: configData.is_active
        });
      }

      // Fetch trial statistics
      await fetchTrialStats();

    } catch (error) {
      console.error('Error fetching trial data:', error);
      toast.error("Erro ao carregar configurações do trial");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrialStats = async () => {
    try {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('is_trial, trial_used, status, created_at, trial_end_date');

      if (error) throw error;

      const totalTrials = subscriptions?.filter(s => s.trial_used).length || 0;
      const activeTrials = subscriptions?.filter(s => 
        s.is_trial && s.status === 'active' && 
        new Date(s.trial_end_date) > new Date()
      ).length || 0;
      const conversions = subscriptions?.filter(s => 
        s.trial_used && s.status === 'active' && !s.is_trial
      ).length || 0;

      setStats({
        totalTrials,
        activeTrials,
        conversions,
        conversionRate: totalTrials > 0 ? (conversions / totalTrials) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching trial stats:', error);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const configData = {
        trial_duration_days: config.trialDurationDays,
        trial_plan_id: config.trialPlanId,
        email_sequence: config.emailSequence,
        is_active: config.isActive
      };

      if (config.id) {
        const { error } = await supabase
          .from('trial_config')
          .update(configData)
          .eq('id', config.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('trial_config')
          .insert(configData)
          .select()
          .single();
        
        if (error) throw error;
        setConfig(prev => ({ ...prev, id: data.id }));
      }

      toast.success("Configurações salvas com sucesso");

    } catch (error) {
      console.error('Error saving trial config:', error);
      toast.error("Erro ao salvar as configurações");
    } finally {
      setSaving(false);
    }
  };

  const addEmailToSequence = () => {
    setConfig(prev => ({
      ...prev,
      emailSequence: [
        ...prev.emailSequence,
        {
          day: prev.emailSequence.length + 1,
          subject: '',
          template: 'trial_reminder',
          enabled: true
        }
      ]
    }));
  };

  const updateEmailInSequence = (index: number, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      emailSequence: prev.emailSequence.map((email, i) => 
        i === index ? { ...email, [field]: value } : email
      )
    }));
  };

  const removeEmailFromSequence = (index: number) => {
    setConfig(prev => ({
      ...prev,
      emailSequence: prev.emailSequence.filter((_, i) => i !== index)
    }));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Configuração de Trial</h3>
        <Button onClick={saveConfig} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Trials</p>
                <p className="text-2xl font-bold">{stats.totalTrials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Trials Ativos</p>
                <p className="text-2xl font-bold">{stats.activeTrials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold">{stats.conversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trialDays">Duração do Trial (dias)</Label>
              <Input
                id="trialDays"
                type="number"
                value={config.trialDurationDays}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  trialDurationDays: parseInt(e.target.value) || 14
                }))}
                min="1"
                max="90"
              />
            </div>

            <div className="space-y-2">
              <Label>Plano do Trial</Label>
              <Select 
                value={config.trialPlanId || ''} 
                onValueChange={(value) => setConfig(prev => ({
                  ...prev,
                  trialPlanId: value || null
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
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
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.isActive}
              onCheckedChange={(checked) => setConfig(prev => ({
                ...prev,
                isActive: checked
              }))}
            />
            <Label>Ativar sistema de trial</Label>
          </div>
        </CardContent>
      </Card>

      {/* Email Sequence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sequência de Emails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.emailSequence.map((email, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Email #{index + 1}</h4>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeEmailFromSequence(index)}
                >
                  Remover
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Dia do Trial</Label>
                  <Input
                    type="number"
                    value={email.day}
                    onChange={(e) => updateEmailInSequence(index, 'day', parseInt(e.target.value) || 1)}
                    min="1"
                    max={config.trialDurationDays}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <Input
                    value={email.subject}
                    onChange={(e) => updateEmailInSequence(index, 'subject', e.target.value)}
                    placeholder="Assunto do email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select 
                    value={email.template} 
                    onValueChange={(value) => updateEmailInSequence(index, 'template', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial_welcome">Boas-vindas</SelectItem>
                      <SelectItem value="trial_reminder">Lembrete</SelectItem>
                      <SelectItem value="trial_ending">Finalizando</SelectItem>
                      <SelectItem value="trial_conversion">Conversão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={email.enabled}
                  onCheckedChange={(checked) => updateEmailInSequence(index, 'enabled', checked)}
                />
                <Label>Email ativo</Label>
              </div>
            </div>
          ))}

          <Button onClick={addEmailToSequence} variant="outline" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Adicionar Email à Sequência
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialConfigManager;