
import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateMessageProps {
  message: string;
  height?: string;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ 
  message, 
  height = "300px" 
}) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="flex items-center justify-center text-gray-400 bg-gray-50 rounded" 
      style={{ height }}
    >
      <div className="text-center">
        <p>{message}</p>
        {message === t('dashboard.charts.noData') && (
          <p className="text-sm mt-2">{t('dashboard.emptyState.message')}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyStateMessage;
