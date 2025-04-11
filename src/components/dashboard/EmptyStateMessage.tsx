
import React from 'react';

interface EmptyStateMessageProps {
  message: string;
  height?: string;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ 
  message, 
  height = "300px" 
}) => {
  return (
    <div 
      className="flex items-center justify-center text-gray-400 bg-gray-50 rounded" 
      style={{ height }}
    >
      <div className="text-center">
        <p>{message}</p>
        <p className="text-sm mt-2">{message === "No data to display" ? "Start tracking to see your data" : ""}</p>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
