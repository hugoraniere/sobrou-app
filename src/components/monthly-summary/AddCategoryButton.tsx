
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCategoryButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
  onClick,
  className = ""
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-xs h-6 px-2 ${className}`}
    >
      <Plus className="h-2.5 w-2.5 mr-1" />
      Adicionar categoria
    </Button>
  );
};
