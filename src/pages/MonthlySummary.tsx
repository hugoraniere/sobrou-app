// app/(pages)/monthly/summary/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialData = [
  { category: 'Moradia', value: '' },
  { category: 'Transporte', value: '' },
  { category: 'Alimentação', value: '' },
  { category: 'Lazer', value: '' },
  { category: 'Saúde', value: '' },
];

export default function MonthlySummary() {
  const [data, setData] = useState(initialData);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].value = value;
    setData(updated);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setData([...data, { category: capitalize(newCategory.trim()), value: '' }]);
      setNewCategory('');
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <main className="w-full max-w-[100vw] px-4 md:px-8 py-6 overflow-x-hidden">
      <div className="mx-auto max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-semibold">Resumo Mensal</h1>

        <Card className="p-4 space-y-4 w-full overflow-x-auto">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <Label className="text-sm min-w-[120px]">{item.category}</Label>
              <Input
                type="number"
                placeholder="0,00"
                className="text-sm"
                value={item.value}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Input
              placeholder="Nova categoria"
              className="text-sm"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory} variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}