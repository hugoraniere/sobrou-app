
import React from 'react';
import { RepeatIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface RecurringIndicatorProps {
  isRecurring: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isHovered: boolean;
  className?: string;
}

const RecurringIndicator: React.FC<RecurringIndicatorProps> = ({
  isRecurring,
  onToggle,
  isHovered,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div 
      className={cn(
        "cursor-pointer",
        isHovered || isRecurring ? 'opacity-100' : 'opacity-0',
        "group-hover:opacity-100 transition-opacity",
        className
      )}
      onClick={onToggle}
      title={isRecurring 
        ? t('transactions.removeRecurring', "Click to remove recurring") 
        : t('transactions.setRecurring', "Click to set as recurring")}
    >
      <RepeatIcon 
        className={cn(
          "h-4 w-4",
          isRecurring ? 'text-blue-500' : 'text-gray-400'
        )}
      />
    </div>
  );
};

export default RecurringIndicator;
