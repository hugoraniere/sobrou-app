
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Search, Lightbulb, Trophy } from 'lucide-react';
import { Insight } from '@/hooks/useFinancialInsights';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIconAndColor = () => {
    switch (insight.category) {
      case 'warning':
        return { icon: <AlertTriangle className="h-5 w-5 text-red-500" />, color: 'border-l-red-500' };
      case 'opportunity':
        return { icon: <TrendingUp className="h-5 w-5 text-green-500" />, color: 'border-l-green-500' };
      case 'pattern':
        return { icon: <Search className="h-5 w-5 text-blue-500" />, color: 'border-l-blue-500' };
      case 'suggestion':
        return { icon: <Lightbulb className="h-5 w-5 text-yellow-500" />, color: 'border-l-yellow-500' };
      case 'achievement':
        return { icon: <Trophy className="h-5 w-5 text-purple-500" />, color: 'border-l-purple-500' };
      default:
        return { icon: <Lightbulb className="h-5 w-5 text-gray-500" />, color: 'border-l-gray-500' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Card className={`shadow-sm border-l-4 ${color}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {icon}
          {insight.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{insight.description}</p>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
