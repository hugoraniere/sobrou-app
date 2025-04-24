
import { LucideIcon } from 'lucide-react';

export interface CategoryType {
  id: string;
  name: string;
  value: string;
  type: 'income' | 'expense';
  label: string;
  color: string;
  icon: LucideIcon;
}
