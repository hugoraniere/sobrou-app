
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(({ className, size = 'md' }, ref) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-20'
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
