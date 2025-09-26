import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { toast } from 'sonner';

interface ImageUploadOptimizedProps {
  onImageUploaded?: (imageUrl: string, imageId: string) => void;
  uploadSource?: string;
  className?: string;
}

interface UploadPreview {
  file: File;
  preview: string;
  altText: string;
  category: string;
  tags: string[];
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  result?: any;
}

const categories = [
  { value: 'general', label: 'Geral' },
  { value: 'release-notes', label: 'Release Notes' },
  { value: 'blog', label: 'Blog' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product', label: 'Produto' },
  { value: 'team', label: 'Equipe' },
];

export function ImageUploadOptimized({ 
  onImageUploaded, 
  uploadSource = 'manual',
  className 
}: ImageUploadOptimizedProps) {
  const [previews, setPreviews] = useState<UploadPreview[]>([]);
  const [tagInput, setTagInput] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      altText: '',
      category: 'general',
      tags: [],
      uploading: false,
      uploaded: false,
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg']
    },
    multiple: true
  });

  const updatePreview = (index: number, updates: Partial<UploadPreview>) => {
    setPreviews(prev => prev.map((preview, i) => 
      i === index ? { ...preview, ...updates } : preview
    ));
  };

  const removePreview = (index: number) => {
    const preview = previews[index];
    URL.revokeObjectURL(preview.preview);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (index: number) => {
    if (!tagInput.trim()) return;
    
    const tag = tagInput.trim().toLowerCase();
    const preview = previews[index];
    
    if (!preview.tags.includes(tag)) {
      updatePreview(index, {
        tags: [...preview.tags, tag]
      });
    }
    
    setTagInput('');
  };

  const removeTag = (index: number, tagToRemove: string) => {
    const preview = previews[index];
    updatePreview(index, {
      tags: preview.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const uploadImage = async (index: number) => {
    const preview = previews[index];
    updatePreview(index, { uploading: true, error: undefined });

    try {
      const imageUrl = await galleryService.uploadImage(preview.file, {
        altText: preview.altText,
        category: preview.category,
        tags: preview.tags,
        uploadSource
      });

      if (!imageUrl) {
        throw new Error('Falha no upload da imagem');
      }

      updatePreview(index, { 
        uploading: false, 
        uploaded: true,
        result: { url: imageUrl }
      });

      toast.success('Imagem otimizada e salva com sucesso!');
      onImageUploaded?.(imageUrl, 'temp-id');

    } catch (error) {
      console.error('Upload error:', error);
      updatePreview(index, { 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Erro no upload'
      });
      toast.error('Erro no upload da imagem');
    }
  };

  const uploadAll = async () => {
    const unuploadedIndexes = previews
      .map((preview, index) => ({ preview, index }))
      .filter(({ preview }) => !preview.uploaded && !preview.uploading)
      .map(({ index }) => index);

    for (const index of unuploadedIndexes) {
      await uploadImage(index);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSEOTips = (file: File, altText: string, tags: string[]) => {
    const tips = [];
    
    if (file.size > 500000) {
      tips.push('Arquivo grande (>500KB) - será otimizado automaticamente');
    }
    
    if (!altText.trim()) {
      tips.push('Adicione um alt text descritivo para melhorar SEO');
    }
    
    if (tags.length === 0) {
      tips.push('Adicione tags para facilitar a busca');
    }
    
    if (file.name.includes('IMG_') || file.name.includes('Screenshot')) {
      tips.push('Considere um nome mais descritivo');
    }
    
    return tips;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Otimizado de Imagens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Solte as imagens aqui...' : 'Arraste imagens ou clique para selecionar'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Suporta: JPEG, PNG, WebP, GIF, SVG (máx. 20MB por arquivo)
            </p>
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Imagens para Upload ({previews.length})
                </h3>
                {previews.some(p => !p.uploaded && !p.uploading) && (
                  <Button onClick={uploadAll} size="sm">
                    Upload de Todas
                  </Button>
                )}
              </div>

              {previews.map((preview, index) => {
                const seoTips = getSEOTips(preview.file, preview.altText, preview.tags);
                
                return (
                  <Card key={index} className="relative">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image Preview */}
                        <div className="relative">
                          <img
                            src={preview.preview}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          {preview.uploaded && (
                            <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-green-600 bg-white rounded-full" />
                          )}
                          {preview.error && (
                            <AlertCircle className="absolute -top-2 -right-2 h-6 w-6 text-red-600 bg-white rounded-full" />
                          )}
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{preview.file.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(preview.file.size)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePreview(index)}
                              disabled={preview.uploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`alt-${index}`}>Alt Text (SEO)</Label>
                              <Input
                                id={`alt-${index}`}
                                placeholder="Descreva a imagem..."
                                value={preview.altText}
                                onChange={(e) => updatePreview(index, { altText: e.target.value })}
                                disabled={preview.uploading || preview.uploaded}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`category-${index}`}>Categoria</Label>
                              <Select
                                value={preview.category}
                                onValueChange={(value) => updatePreview(index, { category: value })}
                                disabled={preview.uploading || preview.uploaded}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                placeholder="Digite uma tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(index))}
                                disabled={preview.uploading || preview.uploaded}
                                className="flex-1"
                              />
                              <Button 
                                type="button"
                                size="sm"
                                onClick={() => addTag(index)}
                                disabled={preview.uploading || preview.uploaded}
                              >
                                Adicionar
                              </Button>
                            </div>
                            {preview.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {preview.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                    {!preview.uploading && !preview.uploaded && (
                                      <button
                                        onClick={() => removeTag(index, tag)}
                                        className="ml-1 hover:text-destructive"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* SEO Tips */}
                          {seoTips.length > 0 && (
                            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Dicas de SEO:</p>
                                <ul className="space-y-0.5">
                                  {seoTips.map((tip, tipIndex) => (
                                    <li key={tipIndex}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-between items-center">
                            <div>
                              {preview.error && (
                                <p className="text-sm text-destructive">{preview.error}</p>
                              )}
                              {preview.uploaded && (
                                <p className="text-sm text-green-600">✓ Upload concluído com sucesso</p>
                              )}
                            </div>
                            
                            {!preview.uploaded && (
                              <Button
                                onClick={() => uploadImage(index)}
                                disabled={preview.uploading}
                                size="sm"
                              >
                                {preview.uploading ? 'Otimizando...' : 'Fazer Upload'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}