import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { SupportTopic } from '@/types/support';

interface CategoryGridProps {
  topics: SupportTopic[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ topics }) => {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
    return Icon;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour-id="support.categories.category-grid">
      {topics.map((topic) => {
        const Icon = getIcon(topic.icon);
        
        return (
          <Link key={topic.id} to={`/suporte?topic=${topic.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {topic.name}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;