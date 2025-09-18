import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { Save, Trash2, Plus } from 'lucide-react';

const StatementImportEditor: React.FC = () => {
  const { getConfig, updateConfig } = useLandingPage();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const statementConfig = getConfig('statement_import');
    if (statementConfig) {
      setConfig(statementConfig.content);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    try {
      await updateConfig('statement_import', config);
    } catch (error) {
      console.error('Error saving statement import config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (!config) return;
    setConfig({
      ...config,
      features: [...config.features, 'Nova funcionalidade']
    });
  };

  const updateFeature = (index: number, value: string) => {
    if (!config) return;
    const updatedFeatures = config.features.map((feature: string, i: number) => 
      i === index ? value : feature
    );
    setConfig({ ...config, features: updatedFeatures });
  };

  const removeFeature = (index: number) => {
    if (!config) return;
    const updatedFeatures = config.features.filter((_: string, i: number) => i !== index);
    setConfig({ ...config, features: updatedFeatures });
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="statement-title">Título</Label>
          <Input
            id="statement-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Título da seção"
          />
        </div>
        <div>
          <Label htmlFor="statement-cta">Texto do Botão</Label>
          <Input
            id="statement-cta"
            value={config.cta_text}
            onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
            placeholder="Texto do CTA"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="statement-subtitle">Subtítulo</Label>
        <Textarea
          id="statement-subtitle"
          value={config.subtitle}
          onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
          placeholder="Subtítulo descritivo"
          rows={3}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Funcionalidades</CardTitle>
            <Button variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Funcionalidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Descrição da funcionalidade"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default StatementImportEditor;