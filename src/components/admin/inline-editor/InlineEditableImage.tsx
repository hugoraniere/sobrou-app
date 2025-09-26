import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, ImageIcon, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandingPage } from '@/contexts/LandingPageContext';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useLandingPage();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, section);
      if (imageUrl) {
        onImageChange(imageUrl);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageChange('');
    }
  };

  if (!src) {
    return (
      <div className="group relative" style={{ aspectRatio: '16/9', minHeight: '200px' }}>
        <div 
          className="w-full h-full bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-16 h-16 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Clique para adicionar imagem</p>
          <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, WebP até 5MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={src} 
        alt={alt || 'Landing page image'} 
        className={cn(
          "w-full h-full object-cover transition-all duration-200",
          className
        )}
        style={{ aspectRatio: 'inherit' }}
      />
      
      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Hover overlay with controls */}
      {isHovered && !isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-black shadow-md"
              title="Substituir imagem"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="bg-red-500/90 hover:bg-red-500 text-white shadow-md"
              title="Remover imagem"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default InlineEditableImage;