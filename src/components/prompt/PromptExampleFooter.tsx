import React from 'react';
import { format } from "date-fns";
interface PromptExampleFooterProps {
  selectedDate: Date;
  className?: string;
}
const PromptExampleFooter: React.FC<PromptExampleFooterProps> = ({
  selectedDate,
  className
}) => {
  return <div className={`flex justify-between mt-2 ${className || ''}`}>
      <p className="text-gray-500 text-xs">
        Experimente: "Recebi R$1500 de salário", ou "Guardei R$100 para férias"
      </p>
      <p className="text-gray-500 text-xs">
        Data: {format(selectedDate, 'dd/MM/yyyy')}
      </p>
    </div>;
};
export default PromptExampleFooter;