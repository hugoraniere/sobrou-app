import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { clearAllAndHardReload } from '@/utils/cacheUtils';
import { toast } from 'sonner';

const CacheClearButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    if (isClearing) return;
    
    setIsClearing(true);
    
    try {
      toast.info('Limpando cache e recarregando...', {
        description: 'Isso pode levar alguns segundos.'
      });
      
      await clearAllAndHardReload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Erro ao limpar cache', {
        description: 'Tente recarregar a página manualmente.'
      });
      setIsClearing(false);
    }
  };

  return (
    <Button
      onClick={handleClearCache}
      disabled={isClearing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isClearing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {isClearing ? 'Limpando...' : 'Limpar Cache'}
    </Button>
  );
};

export default CacheClearButton;