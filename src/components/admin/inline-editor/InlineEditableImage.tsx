import React, { useState, useRef } from 'react';
import { Upload, Trash2, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandingPage } from '@/contexts/LandingPageContext';
import ImagePlaceholder from '@/components/ui/image-placeholder';
import { EditorButton } from '@/components/ui/editor-button';
import MediaLibraryModal from '@/components/admin/media/MediaLibraryModal';

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
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
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
      <div className={cn("relative", containerClassName)} style={{ aspectRatio: '16/9', minHeight: '200px' }}>
        <ImagePlaceholder
          onImageSelect={() => fileInputRef.current?.click()}
          className={className}
          aspectRatio="inherit"
          minHeight="inherit"
          title="Clique para adicionar imagem"
          subtitle="JPG, PNG, WebP até 5MB"
          isLoading={isUploading}
          showLibraryButton
          onLibraryClick={() => setShowMediaLibrary(true)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onImageSelect={onImageChange}
          onUploadNew={() => fileInputRef.current?.click()}
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 rounded-lg">
          <div className="flex gap-2">
            <EditorButton
              variant="toolbar"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Upload nova imagem"
              icon={<Upload className="w-4 h-4" />}
            />
            <EditorButton
              variant="toolbar"
              size="icon"
              onClick={() => setShowMediaLibrary(true)}
              title="Escolher da biblioteca"
              icon={<Image className="w-4 h-4" />}
            />
            <EditorButton
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              title="Remover imagem"
              icon={<Trash2 className="w-4 h-4" />}
            />
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
      
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onImageSelect={onImageChange}
        onUploadNew={() => fileInputRef.current?.click()}
      />
    </div>
  );
};

export default InlineEditableImage;