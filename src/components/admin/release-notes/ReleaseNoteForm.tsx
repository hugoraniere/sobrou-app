import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Upload, X, Images } from 'lucide-react';
import { ReleaseNote, ReleaseNotesService } from '@/services/releaseNotesService';
import { toast } from 'sonner';
import ReleaseNotePreview from './ReleaseNotePreview';
import MediaLibraryModal from '@/components/admin/media/MediaLibraryModal';

interface ReleaseNoteFormProps {
  initialData?: Partial<ReleaseNote>;
  onSave: (data: Partial<ReleaseNote>) => void;
  onCancel: () => void;
}

const ReleaseNoteForm: React.FC<ReleaseNoteFormProps> = ({ 
  initialData = {}, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<ReleaseNote>>({
    name: '',
    title: '',
    description: '',
    image_url: '',
    image_position: 'center',
    size: 'medium',
    cta_text: '',
    cta_url: '',
    secondary_button_text: 'Fechar',
    secondary_button_action: 'close',
    secondary_button_url: '',
    version: '1.0',
    display_behavior: 'once',
    is_active: false,
    ...initialData
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleInputChange = (field: keyof ReleaseNote, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await ReleaseNotesService.uploadImage(file);
      handleInputChange('image_url', imageUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title) {
      toast.error('Nome e título são obrigatórios');
      return;
    }
    onSave(formData);
  };

  const removeImage = () => {
    handleInputChange('image_url', '');
  };

  const handleMediaLibraryUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const imageUrl = await ReleaseNotesService.uploadImage(file);
      handleInputChange('image_url', imageUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    handleInputChange('image_url', imageUrl);
    setShowMediaLibrary(false);
    toast.success('Imagem selecionada da galeria!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {initialData.id ? 'Editar Release Note' : 'Novo Release Note'}
        </h2>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" form="release-note-form">
            {initialData.id ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="release-note-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Interno</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Atualização Janeiro 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título que aparece para o usuário"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva as novidades e melhorias"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="version">Versão</Label>
                <Input
                  id="version"
                  value={formData.version || ''}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="Ex: 2.1.0"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Exibição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="size">Tamanho do Modal</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="display_behavior">Quando Exibir</Label>
              <Select 
                value={formData.display_behavior} 
                onValueChange={(value) => handleInputChange('display_behavior', value as 'once' | 'every_login' | 'on_dismiss')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Uma única vez por usuário</SelectItem>
                  <SelectItem value="every_login">Toda vez que logar</SelectItem>
                  <SelectItem value="on_dismiss">Até clicar em fechar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active || false}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Release Note Ativo</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.image_url ? (
              <div className="relative">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMediaLibrary(true)}
                    className="flex items-center gap-2"
                  >
                    <Images className="h-4 w-4" />
                    Escolher da Galeria
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={imageUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Enviar Nova
                  </Button>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="hidden"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="image_position">Posição da Imagem</Label>
              <Select 
                value={formData.image_position} 
                onValueChange={(value) => handleInputChange('image_position', value as 'left' | 'center' | 'right')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Alinhada à Esquerda</SelectItem>
                  <SelectItem value="center">Centralizada</SelectItem>
                  <SelectItem value="right">Alinhada à Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {imageUploading && <p className="text-sm text-gray-500">Enviando imagem...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botões de Ação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cta_text">Texto do Botão Principal (Opcional)</Label>
              <Input
                id="cta_text"
                value={formData.cta_text || ''}
                onChange={(e) => handleInputChange('cta_text', e.target.value)}
                placeholder="Ex: Veja as novidades"
              />
            </div>

            <div>
              <Label htmlFor="cta_url">URL do Botão Principal</Label>
              <Input
                id="cta_url"
                value={formData.cta_url || ''}
                onChange={(e) => handleInputChange('cta_url', e.target.value)}
                placeholder="https://exemplo.com"
                type="url"
              />
            </div>

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">Botão Secundário</h4>
              
              <div>
                <Label htmlFor="secondary_button_text">Texto do Botão Secundário</Label>
                <Input
                  id="secondary_button_text"
                  value={formData.secondary_button_text || ''}
                  onChange={(e) => handleInputChange('secondary_button_text', e.target.value)}
                  placeholder="Ex: Fechar, Pular, Mais tarde"
                />
              </div>

              <div>
                <Label htmlFor="secondary_button_action">Ação do Botão</Label>
                <Select 
                  value={formData.secondary_button_action} 
                  onValueChange={(value) => handleInputChange('secondary_button_action', value as 'close' | 'custom_link')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="close">Fechar Modal</SelectItem>
                    <SelectItem value="custom_link">Link Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.secondary_button_action === 'custom_link' && (
                <div>
                  <Label htmlFor="secondary_button_url">URL do Botão Secundário</Label>
                  <Input
                    id="secondary_button_url"
                    value={formData.secondary_button_url || ''}
                    onChange={(e) => handleInputChange('secondary_button_url', e.target.value)}
                    placeholder="https://exemplo.com"
                    type="url"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReleaseNotePreview
        note={formData}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onImageSelect={handleImageSelect}
        onImageUpload={handleMediaLibraryUpload}
      />
    </div>
  );
};

export default ReleaseNoteForm;