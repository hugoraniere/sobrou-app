import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { Save, Trash2, Plus } from 'lucide-react';

const SecurityEditor: React.FC = () => {
  const { getConfig, updateConfig } = useLandingPage();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const securityConfig = getConfig('security');
    if (securityConfig) {
      setConfig(securityConfig.content);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    try {
      await updateConfig('security', config);
    } catch (error) {
      console.error('Error saving security config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (!config) return;
    setConfig({
      ...config,
      features: [...config.features, 'Nova funcionalidade de segurança']
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

  const addCertification = () => {
    if (!config) return;
    setConfig({
      ...config,
      certifications: [...config.certifications, 'Nova certificação']
    });
  };

  const updateCertification = (index: number, value: string) => {
    if (!config) return;
    const updatedCertifications = config.certifications.map((cert: string, i: number) => 
      i === index ? value : cert
    );
    setConfig({ ...config, certifications: updatedCertifications });
  };

  const removeCertification = (index: number) => {
    if (!config) return;
    const updatedCertifications = config.certifications.filter((_: string, i: number) => i !== index);
    setConfig({ ...config, certifications: updatedCertifications });
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="security-title">Título</Label>
          <Input
            id="security-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Título da seção de segurança"
          />
        </div>

        <div>
          <Label htmlFor="security-subtitle">Subtítulo</Label>
          <Textarea
            id="security-subtitle"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder="Subtítulo descritivo"
            rows={3}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recursos de Segurança</CardTitle>
            <Button variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Recurso
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
                  placeholder="Recurso de segurança"
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certificações</CardTitle>
            <Button variant="outline" size="sm" onClick={addCertification}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Certificação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="Nome da certificação"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCertification(index)}
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

export default SecurityEditor;