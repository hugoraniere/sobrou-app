
import { useState, useEffect, useMemo } from 'react';
import { categoryKeywords, categoryMeta } from '@/data/categoryKeywords';
import { removeAccents } from '@/lib/utils';
import { CategoryType } from '@/types/categories';

export const useCategoryDetection = (text: string) => {
  const [detectedCategories, setDetectedCategories] = useState<string[]>([]);

  const normalizedKeywords = useMemo(() => {
    const normalized: Record<string, string[]> = {};
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      normalized[category] = keywords.map(k => removeAccents(k.toLowerCase()));
    });
    return normalized;
  }, []);

  useEffect(() => {
    if (!text) {
      setDetectedCategories([]);
      return;
    }

    const normalizedText = removeAccents(text.toLowerCase());
    const detected = new Set<string>();

    Object.entries(normalizedKeywords).forEach(([category, keywords]) => {
      const matches = keywords.some(keyword => normalizedText.includes(keyword));
      if (matches) {
        detected.add(category);
      }
    });

    setDetectedCategories(Array.from(detected));
  }, [text, normalizedKeywords]);

  const categories = detectedCategories.map(id => categoryMeta[id]) as CategoryType[];
  
  return {
    categories,
    removeCategory: (categoryId: string) => {
      setDetectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };
};
