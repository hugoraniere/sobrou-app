import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAnchorReindex } from '@/hooks/useAnchorReindex';
import { AnchorReindexProgress } from '@/types/anchor-maintenance';

interface AnchorReindexManagerProps {
  route?: string;
  onComplete?: (progress: AnchorReindexProgress) => void;
  className?: string;
}

export const AnchorReindexManager: React.FC<AnchorReindexManagerProps> = ({
  route,
  onComplete,
  className
}) => {
  const {
    progress,
    isReindexing,
    startReindex,
    resetProgress,
    getProgressPercentage,
    getStatusMessage
  } = useAnchorReindex({ route, onComplete });

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'scanning':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-destructive';
      case 'scanning':
      case 'processing':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Reindexar Âncoras
        </CardTitle>
        <CardDescription>
          Atualizar metadados e thumbnails das âncoras na rota atual
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Action Button */}
        <Button
          onClick={() => startReindex()}
          disabled={isReindexing}
          className="w-full"
          variant={progress.status === 'completed' ? 'outline' : 'default'}
        >
          {isReindexing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isReindexing ? 'Reindexando...' : 'Reindexar Rota Atual'}
        </Button>

        {/* Progress */}
        {progress.status !== 'idle' && (
          <div className="space-y-3">
            {/* Progress Bar */}
            {(progress.status === 'scanning' || progress.status === 'processing') && (
              <div className="space-y-2">
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{progress.current} de {progress.total}</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
              </div>
            )}

            {/* Status Message */}
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>

            {/* Results Summary */}
            {progress.status === 'completed' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{progress.updated}</div>
                  <div className="text-xs text-muted-foreground">Atualizadas</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">{progress.created}</div>
                  <div className="text-xs text-muted-foreground">Criadas</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-orange-600">{progress.invalid}</div>
                  <div className="text-xs text-muted-foreground">Inválidas</div>
                </div>
              </div>
            )}

            {/* Errors */}
            {progress.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">Erros encontrados:</div>
                    {progress.errors.map((error, index) => (
                      <div key={index} className="text-sm opacity-90">
                        • {error}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Reset Button */}
            {(progress.status === 'completed' || progress.status === 'error') && (
              <Button
                onClick={resetProgress}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Limpar Resultado
              </Button>
            )}
          </div>
        )}

        {/* Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            A reindexação processa apenas elementos com <code className="px-1 py-0.5 bg-muted rounded text-xs">data-tour-id</code> na página atual.
            Âncoras não encontradas serão marcadas como inválidas.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};