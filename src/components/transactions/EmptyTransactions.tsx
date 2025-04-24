
import React from 'react';

const EmptyTransactions: React.FC = () => {
  return (
    <div className="py-8 text-center text-gray-500">
      Nenhuma transação encontrada com os filtros atuais.
    </div>
  );
};

export default EmptyTransactions;
