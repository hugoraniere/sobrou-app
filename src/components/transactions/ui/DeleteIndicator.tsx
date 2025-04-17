
import React from 'react';
import { Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';

interface DeleteIndicatorProps {
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}

const DeleteIndicator: React.FC<DeleteIndicatorProps> = ({
  onDelete,
  className
}) => {
  return (
    <div 
      className={cn(
        "absolute right-4 top-1/2 transform -translate-y-1/2 hidden group-hover:block",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(e);
      }}
    >
      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer" />
    </div>
  );
};

export default DeleteIndicator;
