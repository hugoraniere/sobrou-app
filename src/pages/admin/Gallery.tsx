import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { galleryService, GalleryImage } from '@/services/galleryService';
import { ImagePreviewModal } from '@/components/admin/ImagePreviewModal';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { 
  Upload, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const imagesList = await galleryService.getAllImages();
      setImages(imagesList);
    } catch (error) {
      console.error('Error loading images:', error);
        toast({
          message: 'Erro ao carregar imagens da galeria',
          type: 'error'
        });
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    if (!searchTerm.trim()) {
      setFilteredImages(images);
      return;
    }

    const filtered = images.filter(image =>
      image.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          message: `${file.name} não é uma imagem válida`,
          type: 'error'
        });
        return null;
      }

      const url = await galleryService.uploadImage(file);
      return url;
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(Boolean).length;
      
      if (successCount > 0) {
        toast({
          message: `${successCount} imagem(ns) enviada(s) com sucesso`,
          type: 'success'
        });
        await loadImages();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        message: 'Erro ao enviar imagens',
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRename = async () => {
    if (!selectedImage || !newFileName.trim()) return;

    const fileExtension = selectedImage.file_name.split('.').pop();
    const finalName = newFileName.includes('.') ? newFileName : `${newFileName}.${fileExtension}`;

    const success = await galleryService.renameImage(selectedImage.file_name, finalName);
    
    if (success) {
      toast({
        message: 'Imagem renomeada com sucesso',
        type: 'success'
      });
      await loadImages();
    } else {
      toast({
        message: 'Erro ao renomear imagem',
        type: 'error'
      });
    }

    setRenameModalOpen(false);
    setSelectedImage(null);
    setNewFileName('');
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Tem certeza que deseja deletar "${image.original_name}"?`)) return;

    const success = await galleryService.deleteImage(image.file_name);
    
    if (success) {
      toast({
        message: 'Imagem deletada com sucesso',
        type: 'success'
      });
      await loadImages();
    } else {
      toast({
        message: 'Erro ao deletar imagem',
        type: 'error'
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      message: 'URL copiada para a área de transferência',
      type: 'success'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openRenameModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setNewFileName(image.original_name.split('.')[0]); // Remove extensão para facilitar edição
    setRenameModalOpen(true);
  };

  const openPreviewModal = (imageIndex: number) => {
    setPreviewImageIndex(imageIndex);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Galeria de Imagens</h1>
          <p className="text-muted-foreground">
            Gerencie todas as imagens utilizadas no sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
          />
          <Button
            asChild
            disabled={uploading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Enviando...' : 'Enviar Imagens'}
            </label>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{images.length}</p>
                <p className="text-sm text-muted-foreground">Total de Imagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Upload className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {formatFileSize(images.reduce((total, img) => total + img.file_size, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Espaço Utilizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Search className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredImages.length}</p>
                <p className="text-sm text-muted-foreground">Imagens Filtradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar imagens por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Arraste e solte imagens aqui
            </p>
            <p className="text-muted-foreground">
              ou clique no botão "Enviar Imagens" acima
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens da Galeria</CardTitle>
          <CardDescription>
            {filteredImages.length} de {images.length} imagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Carregando imagens...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma imagem encontrada</p>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente uma busca diferente' : 'Envie suas primeiras imagens'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <Card key={image.id} className="group overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={image.publicUrl}
                      alt={image.alt_text || image.original_name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => openPreviewModal(index)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => copyToClipboard(image.publicUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => openRenameModal(image)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(image)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <p className="font-medium text-sm truncate" title={image.original_name}>
                      {image.original_name}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(image.file_size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {image.mime_type.split('/')[1]?.toUpperCase() || 'IMG'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Imagem</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedImage && (
              <div className="text-center">
                <img
                  src={selectedImage.publicUrl}
                  alt={selectedImage.alt_text || selectedImage.original_name}
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Nome atual: {selectedImage.original_name}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Novo nome
              </label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Nome da imagem"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A extensão será mantida automaticamente
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRenameModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRename}
                disabled={!newFileName.trim()}
              >
                Renomear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        images={filteredImages}
        currentIndex={previewImageIndex}
        onNavigate={setPreviewImageIndex}
      />
    </div>
  );
};

export default Gallery;