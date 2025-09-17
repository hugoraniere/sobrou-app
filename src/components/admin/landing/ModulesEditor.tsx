import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { ModuleConfig } from '@/services/landingPageService';
import { Save, Upload, Trash2, Plus } from 'lucide-react';

const ModulesEditor: React.FC = () => {
  const { getConfig, updateConfig, uploadImage } = useLandingPage();
  const [config, setConfig] = useState<{ title: string; subtitle: string; modules: ModuleConfig[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const modulesConfig = getConfig('modules');
    if (modulesConfig) {
      setConfig(modulesConfig.content);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    try {
      await updateConfig('modules', config);
    } catch (error) {
      console.error('Error saving modules config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    if (!config) return;
    const newModule: ModuleConfig = {
      icon: 'Star',
      title: 'Novo Módulo',
      description: 'Descrição do novo módulo',
      image: '/placeholder.svg'
    };
    setConfig({
      ...config,
      modules: [...config.modules, newModule]
    });
  };

  const updateModule = (index: number, field: keyof ModuleConfig, value: string) => {
    if (!config) return;
    const updatedModules = config.modules.map((module, i) => 
      i === index ? { ...module, [field]: value } : module
    );
    setConfig({ ...config, modules: updatedModules });
  };

  const removeModule = (index: number) => {
    if (!config) return;
    const updatedModules = config.modules.filter((_, i) => i !== index);
    setConfig({ ...config, modules: updatedModules });
  };

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !config) return;

    try {
      const imageUrl = await uploadImage(file, `module-${index}`);
      if (imageUrl) {
        updateModule(index, 'image', imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="modules-title">Título da Seção</Label>
          <Input
            id="modules-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Título da seção de módulos"
          />
        </div>
        <div>
          <Label htmlFor="modules-subtitle">Subtítulo</Label>
          <Textarea
            id="modules-subtitle"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder="Subtítulo descritivo"
            rows={2}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Módulos</CardTitle>
            <Button variant="outline" size="sm" onClick={addModule}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Módulo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {config.modules.map((module, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Módulo {index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeModule(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Ícone (Lucide)</Label>
                      <Input
                        value={module.icon}
                        onChange={(e) => updateModule(index, 'icon', e.target.value)}
                        placeholder="MessageSquare"
                      />
                    </div>
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(index, 'title', e.target.value)}
                        placeholder="Título do módulo"
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={module.description}
                        onChange={(e) => updateModule(index, 'description', e.target.value)}
                        placeholder="Descrição do módulo"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Imagem</Label>
                    <div className="border rounded-lg p-3 bg-muted">
                      <img 
                        src={module.image} 
                        alt="Preview" 
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`module-image-${index}`)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Alterar Imagem
                      </Button>
                      <input
                        id={`module-image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
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

export default ModulesEditor;