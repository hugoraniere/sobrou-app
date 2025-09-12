import { useMemo } from 'react';
import { LayoutDashboard, FileText, Users, MessageSquare } from 'lucide-react';

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
      title: 'Gerenciar Conteúdo',
      url: '/admin/content',
      icon: FileText,
    },
    {
      title: 'Central de Suporte',
      url: '/admin/support',
      icon: MessageSquare,
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