import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, X } from 'lucide-react';

interface BlogTag {
  id: string;
  name: string;
  created_at: string;
}

interface CategoryNavigationProps {
  tags: BlogTag[];
  selectedCategory?: string;
  onCategorySelect: (category?: string) => void;
  loading?: boolean;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  tags,
  selectedCategory,
  onCategorySelect,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Navegue por categorias</h3>
        </div>
        <div className="flex gap-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-8 bg-muted animate-pulse rounded-full px-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Navegue por categorias</h3>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategorySelect(undefined)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtro
          </Button>
        )}
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2 pb-2">
          <Badge
            variant={!selectedCategory ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onCategorySelect(undefined)}
          >
            Todas as categorias
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedCategory === tag.name ? "default" : "secondary"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onCategorySelect(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </ScrollArea>
      
      {selectedCategory && (
        <div className="mt-3 text-sm text-muted-foreground">
          Mostrando artigos da categoria: <span className="font-medium text-foreground">{selectedCategory}</span>
        </div>
      )}
      
      {tags.length === 0 && !loading && (
        <p className="text-muted-foreground text-sm">
          Nenhuma categoria disponível no momento.
        </p>
      )}
    </div>
  );
};

export default CategoryNavigation;