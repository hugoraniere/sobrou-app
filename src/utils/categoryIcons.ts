
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { CategoryType } from "@/types/categories";

// Mapeamento de categorias para ícones
export const categoryIcons: Record<string, LucideIcon> = {
  food: Icons.Utensils,
  groceries: Icons.ShoppingCart,
  transport: Icons.Car,
  entertainment: Icons.Film,
  bills: Icons.FileText,
  shopping: Icons.ShoppingBag,
  health: Icons.Heart,
  education: Icons.BookOpen,
  travel: Icons.Plane,
  home: Icons.Home,
  salary: Icons.Briefcase,
  investment: Icons.TrendingUp,
  other: Icons.HelpCircle,
  // Categorias em português
  alimentacao: Icons.Utensils,
  moradia: Icons.Home,
  transporte: Icons.Car,
  internet: Icons.Wifi,
  cartao: Icons.CreditCard,
  saude: Icons.Heart,
  lazer: Icons.Gamepad,
  compras: Icons.ShoppingBag,
  investimentos: Icons.TrendingUp,
  familia: Icons.Users,
  doacoes: Icons.Gift,
  outros: Icons.HelpCircle,
  // Adicione mais categorias conforme necessário
};

// Função auxiliar para obter o ícone de uma categoria
export const getCategoryIcon = (categoryId: string): LucideIcon => {
  return categoryIcons[categoryId] || categoryIcons.other;
};
