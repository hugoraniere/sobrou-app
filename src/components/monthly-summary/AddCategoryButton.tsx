
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCategoryButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
  onClick,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-xs text-gray-500 hover:text-gray-700 h-8 ${className}`}
    >
      <Plus className="h-3 w-3 mr-1" />
      Adicionar categoria
    </Button>
  );
};
