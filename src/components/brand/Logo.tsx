
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <img 
      src="/lovable-uploads/99c07f63-fffe-4761-a8d8-35c85d058c3a.png"
      alt="Sobrou" 
      className={cn(sizeClasses[size], 'w-auto', className)}
    />
  );
};

export default Logo;

