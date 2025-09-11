import React from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LogoWithAlphaBadgeProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const LogoWithAlphaBadge = React.forwardRef<HTMLDivElement, LogoWithAlphaBadgeProps>(
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
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs pointer-events-none"
                >
                  Alpha
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Estamos em período de testes, crie sua conta gratuitamente e faça parte dos nossos 100 primeiros usuários gratuitos.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

LogoWithAlphaBadge.displayName = 'LogoWithAlphaBadge';

export default LogoWithAlphaBadge;