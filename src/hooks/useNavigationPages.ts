
import { useMemo } from 'react';
import { LayoutDashboard, FileText, Calendar, Target, TrendingUp, Calculator, CreditCard, BookOpen, HelpCircle } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

export interface NavigationPage {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  isOptional?: boolean;
  isVisible?: boolean;
}

export const useNavigationPages = () => {
  const { preferences, isLoading } = useNavigation();

  const allPages: NavigationPage[] = useMemo(() => [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Transações',
      url: '/transactions',
      icon: FileText,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Resumo Mensal',
      url: '/monthly-summary',
      icon: Calendar,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Contas a Pagar',
      url: '/bills-to-pay',
      icon: CreditCard,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Metas',
      url: '/goals',
      icon: Target,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Planejamento',
      url: '/financial-planning',
      icon: TrendingUp,
      isOptional: false,
      isVisible: true,
    },
    {
      title: 'Calculadora de Custos',
      url: '/restaurant-calculator',
      icon: Calculator,
      isOptional: true,
      isVisible: preferences.restaurant_calculator,
    },
    {
      title: 'Blog',
      url: '/blog',
      icon: BookOpen,
      isOptional: false,
      isVisible: true,
    },
  ], [preferences]);

  const visiblePages = useMemo(() => 
    allPages.filter(page => page.isVisible), 
    [allPages]
  );

  const optionalPages = useMemo(() => 
    allPages.filter(page => page.isOptional), 
    [allPages]
  );

  return {
    allPages,
    visiblePages,
    optionalPages,
    isLoading,
  };
};
