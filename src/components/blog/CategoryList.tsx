import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogService } from '@/services/blogService';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag } from 'lucide-react';

interface CategoryWithCount {
  name: string;
  count: number;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const blogService = new BlogService();
        const tagStats = await blogService.getTagStats();
        setCategories(tagStats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {categories.slice(0, 8).map((category) => (
        <Link
          key={category.name}
          to={`/blog?category=${encodeURIComponent(category.name)}`}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm group-hover:text-primary">
              {category.name}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {category.count}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;