
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Gift, TrendingUp } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'goal' | 'saving' | 'tip';
  progress?: number;
}

interface GoalsRecommendationsProps {
  recommendations: Recommendation[];
}

const GoalsRecommendations: React.FC<GoalsRecommendationsProps> = ({ 
  recommendations 
}) => {
  const { t } = useTranslation();
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }
  
  // Function to get the right icon based on recommendation type
  const getIcon = (type: 'goal' | 'saving' | 'tip') => {
    switch (type) {
      case 'goal':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'saving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'tip':
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t('dashboard.recommendations.title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map(recommendation => (
          <Card key={recommendation.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getIcon(recommendation.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-medium text-sm">{recommendation.title}</h4>
                  <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                  
                  {recommendation.progress !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${recommendation.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalsRecommendations;
