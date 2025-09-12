import React from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LogoWithSupportBadgeProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const LogoWithSupportBadge = React.forwardRef<HTMLDivElement, LogoWithSupportBadgeProps>(
  ({ className, size = 'md' }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)}>
        <Logo size={size} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="cursor-default">
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 hover:bg-green-200 text-xs pointer-events-none"
                >
                  Suporte
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Central de ajuda do Sobrou - encontre respostas, crie tickets e obtenha suporte.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

LogoWithSupportBadge.displayName = 'LogoWithSupportBadge';

export default LogoWithSupportBadge;