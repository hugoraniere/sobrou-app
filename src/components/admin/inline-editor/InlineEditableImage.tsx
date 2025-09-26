import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Trash2, 
  ImageIcon,
  Edit3,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from 'sonner';

interface InlineEditableImageProps {
  src?: string;
  alt?: string;
  onImageChange: (url: string) => void;
  onImageRemove?: () => void;
  section: string;
  className?: string;
  placeholder?: string;
  containerClassName?: string;
}

const InlineEditableImage: React.FC<InlineEditableImageProps> = ({
  src,
  alt = '',
  onImageChange,
  onImageRemove,
  section,
  className,
  placeholder = 'Clique para adicionar uma imagem',
  containerClassName
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useLandingPage();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, section);
      if (imageUrl) {
        onImageChange(imageUrl);
        toast('Imagem carregada com sucesso!');
      }
    } catch (error) {
      toast('Erro ao carregar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageChange('');
    }
    setShowOverlay(false);
  };

  if (!src) {
    return (
      <div
        className={cn(
          'relative border-2 border-dashed border-muted-foreground/30 rounded-lg',
          'hover:border-primary/50 transition-colors duration-200 cursor-pointer',
          'flex flex-col items-center justify-center p-8 text-center',
          'bg-muted/20 hover:bg-muted/40',
          containerClassName
        )}
        onClick={handleFileSelect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-2">{placeholder}</p>
        <p className="text-sm text-muted-foreground/70">
          Clique ou arraste uma imagem aqui
        </p>
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={cn('relative group', containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'transition-all duration-200',
          isHovered && 'brightness-75',
          className
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />

      {/* Overlay com controles */}
      {(isHovered || showOverlay) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFileSelect}
            disabled={isUploading}
            className="bg-background/90 hover:bg-background"
          >
            <Upload className="w-4 h-4 mr-2" />
            Substituir
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowOverlay(true)}
            className="bg-background/90 hover:bg-background"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="bg-destructive/90 hover:bg-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      )}

      {/* Overlay de edição detalhada */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-card rounded-lg p-4 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Editar Imagem</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOverlay(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleFileSelect}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Substituir Imagem
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleRemove}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Imagem
              </Button>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default InlineEditableImage;