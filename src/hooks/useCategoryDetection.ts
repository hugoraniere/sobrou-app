
import { useState, useEffect, useMemo } from 'react';
import { categoryKeywords } from '@/data/categoryKeywords';
import { removeAccents } from '@/lib/utils';
import { CategoryType } from '@/types/categories';
import { transactionCategories } from '@/data/categories';

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

  // Encontrar os objetos de categoria baseados nos IDs detectados
  const categories = detectedCategories
    .map(id => transactionCategories.find(cat => cat.id === id))
    .filter(Boolean) as CategoryType[];
  
  return {
    categories,
    removeCategory: (categoryId: string) => {
      setDetectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };
};
