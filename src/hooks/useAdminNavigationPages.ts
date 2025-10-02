import { useMemo } from 'react';
import { LayoutDashboard, FileText, Users, MessageSquare, Monitor, Images, Flag, Palette, Settings } from 'lucide-react';

export interface AdminNavigationPage {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export interface AdminNavigationGroup {
  label: string;
  emoji: string;
  pages: AdminNavigationPage[];
}

export const useAdminNavigationPages = () => {
  const adminGroups: AdminNavigationGroup[] = useMemo(() => [
    {
      label: 'Administração',
      emoji: '📊',
      pages: [
        {
          title: 'Dashboard',
          url: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Gerenciar Usuários',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Planos',
          url: '/admin/plans',
          icon: FileText,
        },
        {
          title: 'Configurações',
          url: '/admin/settings',
          icon: Settings,
        },
      ],
    },
    {
      label: 'Conteúdo',
      emoji: '📚',
      pages: [
        {
          title: 'Gerenciar Conteúdo',
          url: '/admin/content',
          icon: FileText,
        },
        {
          title: 'Galeria',
          url: '/admin/gallery',
          icon: Images,
        },
      ],
    },
    {
      label: 'Suporte e Experiência',
      emoji: '🛠️',
      pages: [
        {
          title: 'Central de Ajuda',
          url: '/admin/support',
          icon: MessageSquare,
        },
        {
          title: 'Onboarding',
          url: '/admin/onboarding',
          icon: Flag,
        },
        {
          title: 'Tour do Produto',
          url: '/admin/product-tour',
          icon: Monitor,
        },
      ],
    },
    {
      label: 'Configuração e Design',
      emoji: '🎨',
      pages: [
        {
          title: 'Landing Page',
          url: '/admin/landing',
          icon: Monitor,
        },
        {
          title: 'Design System',
          url: '/admin/design-system',
          icon: Palette,
        },
      ],
    },
  ], []);

  // Flatten groups to maintain backward compatibility
  const adminPages: AdminNavigationPage[] = useMemo(() => 
    adminGroups.flatMap(group => group.pages), [adminGroups]
  );

  return {
    adminPages,
    adminGroups,
  };
};