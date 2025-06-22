
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface AddCategoryButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
  onClick,
  className = ""
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-xs h-6 px-0 ${className}`}
    >
      <Plus className="h-2.5 w-2.5 mr-1" />
      {isMobile ? 'Adicionar' : 'Adicionar categoria'}
    </Button>
  );
};
