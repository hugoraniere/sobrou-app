import React from 'react';
import { cn } from '@/lib/utils';
import { DESIGN_TOKENS } from '@/constants/designTokens';

type StatusType = 'saving' | 'saved' | 'error' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  timestamp?: Date;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'base' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  timestamp,
  className,
  showIcon = true,
  size = 'base'
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'saving':
        return {
          icon: '●',
          color: 'text-yellow-600',
          message: message || 'Salvando...',
          animate: 'animate-pulse',
        };
      case 'saved':
        return {
          icon: '✓',
          color: 'text-green-600',
          message: message || `Salvo ${timestamp?.toLocaleTimeString() || ''}`,
          animate: '',
        };
      case 'error':
        return {
          icon: '⚠',
          color: 'text-red-600',
          message: message || 'Erro ao salvar',
          animate: '',
        };
      case 'idle':
      default:
        return {
          icon: '○',
          color: 'text-gray-400',
          message: message || 'Pronto',
          animate: '',
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn(
      'flex items-center gap-2 font-medium transition-all duration-200',
      sizeClasses[size],
      config.color,
      config.animate,
      className
    )}>
      {showIcon && (
        <span className="inline-block" aria-hidden="true">
          {config.icon}
        </span>
      )}
      <span>{config.message}</span>
    </div>
  );
};

export default StatusIndicator;