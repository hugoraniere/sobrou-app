import { useMemo } from 'react';
import { LayoutDashboard, FileText, Users, MessageSquare, Monitor, Settings } from 'lucide-react';

export interface AdminNavigationPage {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const useAdminNavigationPages = () => {
  const adminPages: AdminNavigationPage[] = useMemo(() => [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Landing Page',
      url: '/admin/landing',
      icon: Monitor,
    },
    {
      title: 'Gerenciar Conteúdo',
      url: '/admin/content',
      icon: FileText,
    },
    {
      title: 'Central de Ajuda',
      url: '/admin/support',
      icon: MessageSquare,
    },
    {
      title: 'Onboarding',
      url: '/admin/onboarding',
      icon: Settings,
    },
    {
      title: 'Gerenciar Usuários',
      url: '/admin/users',
      icon: Users,
    },
  ], []);

  return {
    adminPages,
  };
};