import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useTagStats } from '@/hooks/useTagStats';
import { Loader2 } from 'lucide-react';

const TagCloud: React.FC = () => {
  const { tagStats, isLoading, error } = useTagStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error || tagStats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma tag encontrada.
      </p>
    );
  }

  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-base';
    if (ratio > 0.6) return 'text-sm';
    if (ratio > 0.4) return 'text-xs';
    return 'text-xs';
  };

  const maxCount = Math.max(...tagStats.map(tag => tag.count));

  return (
    <div className="flex flex-wrap gap-2">
      {tagStats.map((tag) => (
        <Link
          key={tag.name}
          to={`/blog?category=${encodeURIComponent(tag.name)}`}
          className="hover:scale-105 transition-transform"
        >
          <Badge 
            variant="secondary" 
            className={`${getTagSize(tag.count, maxCount)} cursor-pointer hover:bg-primary hover:text-primary-foreground`}
          >
            {tag.name} ({tag.count})
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default TagCloud;