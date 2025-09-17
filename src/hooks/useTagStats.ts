import { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';

interface TagStat {
  name: string;
  count: number;
}

export const useTagStats = () => {
  const [tagStats, setTagStats] = useState<TagStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTagStats = async () => {
      try {
        setIsLoading(true);
        const blogService = new BlogService();
        const stats = await blogService.getTagStats();
        setTagStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching tag stats:', err);
        setError('Failed to load tag statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagStats();
  }, []);

  return {
    tagStats,
    isLoading,
    error,
    refetch: async () => {
      const blogService = new BlogService();
      const stats = await blogService.getTagStats();
      setTagStats(stats);
    }
  };
};