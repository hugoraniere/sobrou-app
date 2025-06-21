import React, { useState } from 'react';

const tabs = [
  { id: 'gastos', label: 'Gastos' },
  { id: 'plano', label: 'Plano' },
  { id: 'comparativo', label: 'Comparativo' },
];

type Props = {
  year: number;
};

export const MonthlySummaryTabs = ({ year }: Props) => {
  const [activeTab, setActiveTab] = useState('gastos');

  return (
    <div className="w-full space-y-4">
      {/* Container de abas */}
      <div className="flex w-full flex-wrap justify-between gap-2 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[80px] sm:min-w-[120px] text-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="w-full bg-background rounded-lg p-4 border">
        {activeTab === 'gastos' && <p>Conteúdo de Gastos para {year}</p>}
        {activeTab === 'plano' && <p>Conteúdo do Plano para {year}</p>}
        {activeTab === 'comparativo' && <p>Conteúdo Comparativo para {year}</p>}
      </div>
    </div>
  );
};