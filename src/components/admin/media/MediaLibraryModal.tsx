import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (url: string) => void;
  onUploadNew: () => void;
}

interface StorageFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: {
    eTag?: string;
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
    contentLength?: number;
    httpStatusCode?: number;
  };
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  onUploadNew
}) => {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('landing-page')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      // Filter only image files
      const imageFiles = (data || []).filter(file => 
        file.metadata?.mimetype?.startsWith('image/') ?? false
      );

      setImages(imageFiles);
    } catch (error) {
      console.error('Error in loadImages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('landing-page')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageSelect = (fileName: string) => {
    const imageUrl = getImageUrl(fileName);
    onImageSelect(imageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Biblioteca de Mídia</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onUploadNew();
                onClose();
              }}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Nova Imagem
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar imagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
              {filteredImages.map((image) => (
                <div
                  key={image.name}
                  className={cn(
                    "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-primary",
                    selectedImage === image.name ? "border-primary ring-2 ring-primary/20" : "border-border"
                  )}
                  onClick={() => setSelectedImage(image.name)}
                  onDoubleClick={() => handleImageSelect(image.name)}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={getImageUrl(image.name)}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageSelect(image.name);
                        }}
                      >
                        Selecionar
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{image.name}</p>
                    <p className="text-white/80 text-xs">
                      {new Date(image.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-sm text-center mb-4">
                {searchTerm 
                  ? `Não foi possível encontrar imagens com "${searchTerm}"`
                  : "Você ainda não fez upload de nenhuma imagem"
                }
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  onUploadNew();
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Fazer Upload da Primeira Imagem
              </Button>
            </div>
          )}
        </ScrollArea>

        {selectedImage && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>{selectedImage}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => handleImageSelect(selectedImage)}>
                Usar Esta Imagem
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibraryModal;