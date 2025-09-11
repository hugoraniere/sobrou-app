import React from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LogoWithAlphaBadgeProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isAdminContext?: boolean;
}

const LogoWithAlphaBadge = React.forwardRef<HTMLDivElement, LogoWithAlphaBadgeProps>(
  ({ className, size = 'md', isAdminContext = false }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)}>
        <Logo size={size} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="cursor-default">
                <Badge 
                  variant="secondary" 
                  className={isAdminContext 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs pointer-events-none"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs pointer-events-none"
                  }
                >
                  {isAdminContext ? 'Admin' : 'Alpha'}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                {isAdminContext 
                  ? 'Você está no painel administrativo do Sobrou'
                  : 'Estamos em período de testes, crie sua conta gratuitamente e faça parte dos nossos 100 primeiros usuários gratuitos.'
                }
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