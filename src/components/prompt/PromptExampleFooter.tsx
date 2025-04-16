
import React from 'react';
import { format } from "date-fns";

interface PromptExampleFooterProps {
  selectedDate: Date;
}

const PromptExampleFooter: React.FC<PromptExampleFooterProps> = ({ selectedDate }) => {
  return (
    <div className="flex justify-between mt-2">
      <p className="text-sm text-gray-500">
        Experimente: "Recebi R$1500 de salário", ou "Guardei R$100 para férias"
      </p>
      <p className="text-sm text-gray-500">
        Data: {format(selectedDate, 'dd/MM/yyyy')}
      </p>
    </div>
  );
};

export default PromptExampleFooter;
