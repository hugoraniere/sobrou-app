
import React from 'react';
import { transactionCategories } from '@/data/categories';

type CategoryProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const allCategories = [
  "Todos",
  "Tecnologia",
  "Moda",
  "Educação",
  "Saúde",
  "Negócios",
  "Criatividade",
  "Lifestyle",
  "Finanças",
  "Entretenimento"
];

const CategoryFilter = ({ activeCategory, setActiveCategory }: CategoryProps) => {
  return (
    <aside className="w-full md:w-64 p-4 shrink-0">
      <h3 className="font-outfit font-semibold text-lg mb-4">Categorias</h3>
      
      <div className="space-y-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`w-full text-left category-button ${
              activeCategory === category ? 'active' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CategoryFilter;
