import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { HeroConfig } from '@/services/landingPageService';
import { Save, Upload, Trash2, Plus, Images } from 'lucide-react';
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaLibraryModal from '@/components/admin/media/MediaLibraryModal';

const HeroEditor: React.FC = () => {
  const { getConfig, updateConfig, uploadImage } = useLandingPage();
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  useEffect(() => {
    const heroConfig = getConfig('hero');
    if (heroConfig) {
      setConfig(heroConfig.content as HeroConfig);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    try {
      await updateConfig('hero', config);
    } catch (error) {
      console.error('Error saving hero config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!config) return;
    setConfig({ ...config, background_image: imageUrl });
    setShowMediaLibrary(false);
    toast.success('Imagem selecionada da galeria!');
  };

  const handleMediaLibraryUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'hero');
      if (imageUrl && config) {
        setConfig({ ...config, background_image: imageUrl });
        toast.success('Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  // Configuração do ReactQuill
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'color': ['#000000', '#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline', 'color'
  ];

  const addBenefit = () => {
    if (!config) return;
    const newBenefit = {
      icon: 'Star',
      title: 'Novo benefício',
      description: 'Descrição do benefício'
    };
    setConfig({
      ...config,
      benefits: [...config.benefits, newBenefit]
    });
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    if (!config) return;
    const updatedBenefits = config.benefits.map((benefit, i) => 
      i === index ? { ...benefit, [field]: value } : benefit
    );
    setConfig({ ...config, benefits: updatedBenefits });
  };

  const removeBenefit = (index: number) => {
    if (!config) return;
    const updatedBenefits = config.benefits.filter((_, i) => i !== index);
    setConfig({ ...config, benefits: updatedBenefits });
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título Principal</Label>
            <ReactQuill
              value={config.title}
              onChange={(value) => setConfig({...config, title: value})}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Digite o título principal"
              style={{ backgroundColor: 'white' }}
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <ReactQuill
              value={config.subtitle}
              onChange={(value) => setConfig({...config, subtitle: value})}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Digite o subtítulo"
              style={{ backgroundColor: 'white' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta_text">Texto do Botão</Label>
              <Input
                id="cta_text"
                value={config.cta_text}
                onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
                placeholder="Texto do CTA"
              />
            </div>
            <div>
              <Label htmlFor="cta_url">URL do Botão</Label>
              <Input
                id="cta_url"
                value={config.cta_url}
                onChange={(e) => setConfig({ ...config, cta_url: e.target.value })}
                placeholder="/auth"
              />
            </div>
          </div>
        </div>

          <div className="space-y-4">
            <div>
              <Label>Imagem de Fundo</Label>
              <div className="space-y-2">
                <div className="border rounded-lg p-4 bg-muted">
                  {config.background_image ? (
                    <img 
                      src={config.background_image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">Nenhuma imagem</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaLibrary(true)}
                  >
                    <Images className="w-4 h-4 mr-2" />
                    Escolher da Galeria
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('hero-image-upload')?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Carregando...' : 'Carregar Imagem'}
                  </Button>
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && config) {
                        handleMediaLibraryUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Benefícios</CardTitle>
            <Button variant="outline" size="sm" onClick={addBenefit}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Benefício
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Benefício {index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Ícone (Lucide)</Label>
                    <Input
                      value={benefit.icon}
                      onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                      placeholder="Star"
                    />
                  </div>
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={benefit.title}
                      onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                      placeholder="Título do benefício"
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input
                      value={benefit.description}
                      onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                      placeholder="Descrição"
                    />
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

      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onImageSelect={handleImageSelect}
        onUploadNew={() => {
          document.getElementById('hero-image-upload')?.click();
        }}
      />
    </div>
  );
};

export default HeroEditor;