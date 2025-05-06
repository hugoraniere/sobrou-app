
import React from 'react';
import { Button } from '@/components/ui/button';
import { Insight } from '@/hooks/useFinancialInsights';
import InsightCard from './InsightCard';
import { RefreshCw } from 'lucide-react';

interface InsightsListProps {
  insights: Insight[];
  isLoading: boolean;
  onRefresh: () => void;
}

const InsightsList: React.FC<InsightsListProps> = ({ insights, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Gerando insights personalizados com IA...</p>
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500 mb-4">Nenhum insight personalizado disponível no momento.</p>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Gerar Insights
        </Button>
      </div>
    );
  }

  // Ordenar insights por prioridade (número mais baixo = prioridade mais alta)
  const sortedInsights = [...insights].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Seus Insights Personalizados</h3>
        <Button onClick={onRefresh} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="space-y-4">
        {sortedInsights.map((insight, index) => (
          <InsightCard key={`${insight.title}-${index}`} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default InsightsList;
