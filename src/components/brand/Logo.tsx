
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(({ className, size = 'md' }, ref) => {
  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-16'
  };

  return (
    <img 
      ref={ref}
      src="/lovable-uploads/076c0413-0b42-4810-b32c-5b627b744797.png"
      alt="Sobrou" 
      className={cn(sizeClasses[size], 'w-auto', className)}
    />
  );
});

Logo.displayName = 'Logo';

export default Logo;
