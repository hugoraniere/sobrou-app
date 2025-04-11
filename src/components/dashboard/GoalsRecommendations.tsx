
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Target, TrendingUp } from 'lucide-react';

interface GoalsRecommendationsProps {
  recommendations: {
    id: string;
    title: string;
    description: string;
    type: 'goal' | 'saving' | 'tip';
    progress?: number;
  }[];
}

const GoalsRecommendations: React.FC<GoalsRecommendationsProps> = ({ recommendations }) => {
  const { t } = useTranslation();
  
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Target className="h-5 w-5 text-purple-500" />;
      case 'saving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('dashboard.recommendations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('dashboard.recommendations.noRecommendations')}
          </p>
        ) : (
          <ul className="space-y-4">
            {recommendations.map((recommendation) => (
              <li key={recommendation.id}>
                <div className="flex gap-3 items-start">
                  {getRecommendationIcon(recommendation.type)}
                  <div className="w-full">
                    <h4 className="text-sm font-medium">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground no-underline hover:no-underline">
                      {recommendation.description}
                    </p>
                    {recommendation.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={recommendation.progress} className="h-2" />
                        <p className="text-xs text-right mt-1">{recommendation.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsRecommendations;
