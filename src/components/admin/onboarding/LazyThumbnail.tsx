import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Image, Loader2 } from 'lucide-react';

interface LazyThumbnailProps {
  thumbUrl?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyThumbnail: React.FC<LazyThumbnailProps> = ({
  thumbUrl,
  alt,
  className,
  width = 120,
  height = 80
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        "border rounded overflow-hidden bg-muted flex items-center justify-center relative",
        className
      )}
      style={containerStyle}
    >
      {/* Skeleton loading state */}
      {!isInView && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/70 to-muted animate-pulse" />
      )}
      
      {/* Loading spinner */}
      {isInView && thumbUrl && !isLoaded && !hasError && (
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      )}
      
      {/* Image */}
      {isInView && thumbUrl && !hasError && (
        <img
          src={thumbUrl}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
        />
      )}
      
      {/* Fallback icon */}
      {(!thumbUrl || hasError) && isInView && (
        <Image className="w-5 h-5 text-muted-foreground" />
      )}
    </div>
  );
};