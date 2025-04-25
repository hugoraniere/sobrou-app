
import React from 'react';
import { Repeat, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ActionsCellProps {
  isRecurring: boolean;
  onToggleRecurring: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  isRecurring,
  onToggleRecurring,
  onDelete,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "flex items-center justify-center gap-3",
      "min-w-[80px] px-2",
      className
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleRecurring}
              className="transition-colors duration-200"
            >
              <Repeat 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isRecurring ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isRecurring 
              ? t('transactions.removeRecurring', "Remover recorrência")
              : t('transactions.setRecurring', "Tornar recorrente")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onDelete}
              className="transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {t('transactions.delete', "Excluir transação")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionsCell;

