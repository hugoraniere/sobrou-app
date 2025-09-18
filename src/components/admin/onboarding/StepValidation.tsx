import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface StepValidationProps {
  anchorId: string;
  pageRoute: string;
  className?: string;
}

export function StepValidation({ anchorId, pageRoute, className = '' }: StepValidationProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkAnchorExists = async () => {
    setIsChecking(true);
    
    try {
      // If we're on the target page, check directly
      if (window.location.pathname === pageRoute) {
        const element = document.querySelector(anchorId);
        setIsValid(!!element);
      } else {
        // For other pages, we can't validate without navigation
        // In a real scenario, you might want to track known anchors
        setIsValid(null);
      }
    } catch (error) {
      console.error('Error checking anchor:', error);
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAnchorExists();
  }, [anchorId, pageRoute]);

  const getBadgeVariant = () => {
    if (isChecking) return 'secondary';
    if (isValid === true) return 'default';
    if (isValid === false) return 'destructive';
    return 'secondary';
  };

  const getBadgeText = () => {
    if (isChecking) return 'Verificando...';
    if (isValid === true) return 'Encontrado';
    if (isValid === false) return 'Não encontrado';
    return 'Não verificado';
  };

  const getIcon = () => {
    if (isChecking) return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (isValid === true) return <CheckCircle className="w-3 h-3" />;
    if (isValid === false) return <XCircle className="w-3 h-3" />;
    return null;
  };

  const openDevMode = () => {
    const url = `${pageRoute}?tour=dev&anchor=${encodeURIComponent(anchorId)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={getBadgeVariant()} className="gap-1">
        {getIcon()}
        {getBadgeText()}
      </Badge>
      
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {anchorId}
      </code>

      {(isValid === false || isValid === null) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={openDevMode}
          className="h-6 px-2 gap-1 text-xs"
        >
          <ExternalLink className="w-3 h-3" />
          Testar
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={checkAnchorExists}
        className="h-6 px-2"
        disabled={isChecking}
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}