import React from 'react';
import { Button } from '@/components/ui/button';
import { clearAllAndHardReload } from '@/utils/pwaUtils';

const PWAResetButton: React.FC = () => {
  if (!import.meta.env.DEV) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button size="sm" variant="secondary" onClick={() => clearAllAndHardReload()}>
        Atualizar app (dev)
      </Button>
    </div>
  );
};

export default PWAResetButton;
