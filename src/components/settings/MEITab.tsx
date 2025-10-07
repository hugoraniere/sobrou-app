import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Save } from 'lucide-react';
import { useMEISettings } from '@/hooks/useMEISettings';
import { formatCurrency } from '@/utils/dashboardUtils';

export const MEITab: React.FC = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useMEISettings();
  const [taxPercentage, setTaxPercentage] = useState<number>(6);
  const [annualLimit, setAnnualLimit] = useState<number>(81000);

  useEffect(() => {
    if (settings) {
      setTaxPercentage(settings.tax_reserve_percentage);
      setAnnualLimit(settings.annual_limit);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      tax_reserve_percentage: taxPercentage,
      annual_limit: annualLimit
    });
  };

  const hasChanges = settings && (
    settings.tax_reserve_percentage !== taxPercentage ||
    settings.annual_limit !== annualLimit
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure os parâmetros do seu MEI para acompanhar melhor suas finanças. 
          <strong> Atenção:</strong> As informações aqui são apenas para controle pessoal. 
          Consulte sempre um contador para questões fiscais e tributárias.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Reserva de Impostos</CardTitle>
          <CardDescription>
            Defina o percentual de cada receita que deseja reservar para impostos (DAS MEI e outros tributos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tax-percentage">
                Percentual de Reserva
              </Label>
              <span className="text-2xl font-bold text-primary">
                {taxPercentage.toFixed(1)}%
              </span>
            </div>
            <Slider
              id="tax-percentage"
              min={0}
              max={20}
              step={0.5}
              value={[taxPercentage]}
              onValueChange={(values) => setTaxPercentage(values[0])}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              O DAS MEI é de R$ 70-75/mês em 2024. Ajuste este percentual conforme suas necessidades.
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Exemplo prático:</p>
            <p className="text-sm text-muted-foreground">
              Com receita de R$ 5.000 e {taxPercentage}% de reserva:
            </p>
            <p className="text-lg font-bold text-primary">
              Reservar: {formatCurrency((5000 * taxPercentage) / 100)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limite Anual de Faturamento</CardTitle>
          <CardDescription>
            Defina o limite anual para acompanhar o progresso do seu faturamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="annual-limit">
              Limite Anual (R$)
            </Label>
            <Input
              id="annual-limit"
              type="number"
              value={annualLimit}
              onChange={(e) => setAnnualLimit(Number(e.target.value))}
              min={0}
              step={1000}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">
              O limite MEI para 2024 é de R$ 81.000,00. Este valor é atualizado anualmente.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Importante:</strong> Ultrapassar o limite MEI pode resultar em mudança de categoria tributária. 
              Consulte seu contador para mais informações.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      )}
    </div>
  );
};
