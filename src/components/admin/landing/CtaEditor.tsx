import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { Save } from 'lucide-react';

const CtaEditor: React.FC = () => {
  const { getConfig, updateConfig } = useLandingPage();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctaConfig = getConfig('cta');
    if (ctaConfig) {
      setConfig(ctaConfig.content);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    const normalized = {
      ...config,
      cta_url: config.cta_url === '/auth' ? '/?auth=1' : (config.cta_url || '/?auth=1')
    };

    setLoading(true);
    try {
      await updateConfig('cta', normalized);
      setConfig(normalized);
    } catch (error) {
      console.error('Error saving CTA config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="cta-title">Título</Label>
          <Input
            id="cta-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Título da seção CTA"
          />
        </div>

        <div>
          <Label htmlFor="cta-subtitle">Subtítulo</Label>
          <Textarea
            id="cta-subtitle"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder="Subtítulo descritivo"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cta-text">Texto do Botão</Label>
            <Input
              id="cta-text"
              value={config.cta_text}
              onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
              placeholder="Texto do botão CTA"
            />
          </div>
          <div>
            <Label htmlFor="cta-url">URL do Botão</Label>
            <Input
              id="cta-url"
              value={config.cta_url}
              onChange={(e) => setConfig({ ...config, cta_url: e.target.value })}
              placeholder="/?auth=1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default CtaEditor;