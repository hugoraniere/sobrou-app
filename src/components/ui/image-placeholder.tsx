import React from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EDITOR_TOKENS } from '@/constants/editorTokens';

interface ImagePlaceholderProps {
  onImageSelect?: () => void;
  className?: string;
  aspectRatio?: string;
  minHeight?: string;
  title?: string;
  subtitle?: string;
  isDragOver?: boolean;
  isLoading?: boolean;
  showUploadIcon?: boolean;
  showLibraryButton?: boolean;
  onLibraryClick?: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  onImageSelect,
  className,
  aspectRatio = '16/9',
  minHeight = '12rem',
  title = 'Clique para adicionar imagem',
  subtitle = 'JPG, PNG, WebP até 5MB',
  isDragOver = false,
  isLoading = false,
  showUploadIcon = false,
  showLibraryButton = false,
  onLibraryClick
}) => {
  const handleClick = () => {
    if (!isLoading && onImageSelect) {
      onImageSelect();
    }
  };

  return (
    <div 
      className={cn(
        // Base styles
        'group relative flex flex-col items-center justify-center',
        'bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg',
        'transition-all duration-200 cursor-pointer',
        
        // Hover state
        'hover:border-primary hover:bg-primary-light',
        
        // Drag over state
        isDragOver && 'border-primary-hover bg-primary/5 scale-[1.02]',
        
        // Loading state
        isLoading && 'pointer-events-none opacity-60',
        
        className
      )}
      style={{ 
        aspectRatio,
        minHeight 
      }}
      onClick={handleClick}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Icon */}
          <div className="flex items-center justify-center mb-3">
            {showUploadIcon ? (
              <Upload className="w-16 h-16 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            ) : (
              <ImageIcon className="w-16 h-16 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-base font-medium text-gray-600 group-hover:text-gray-800 mb-1">
              {title}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {subtitle}
            </p>
            
            {/* Library button */}
            {showLibraryButton && onLibraryClick && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLibraryClick();
                  }}
                  className="text-sm text-primary hover:text-primary-hover transition-colors duration-200"
                >
                  ou escolher da biblioteca
                </button>
              </div>
            )}
          </div>

          {/* Drag indicator */}
          {isDragOver && (
            <div className="absolute inset-0 border-2 border-primary-hover rounded-lg bg-primary/5 flex items-center justify-center">
              <div className="text-primary-hover font-medium">
                Solte a imagem aqui
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;