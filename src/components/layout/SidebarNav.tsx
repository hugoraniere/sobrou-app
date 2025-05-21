import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, Target, Settings, LogOut, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/contexts/AvatarContext';
import Logo from '../brand/Logo';

const SidebarNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const { state, toggleSidebar } = useSidebar();
  const { avatarUrl } = useAvatar();

  const navigationItems = [
    {
      name: t('common.dashboard', 'Dashboard'),
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: t('common.transactions', 'Transações'),
      path: '/transactions',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: t('common.goals', 'Metas'),
      path: '/goals',
      icon: <Target className="w-5 h-5" />,
    },
    {
      name: t('financialPlanning.title', 'Planejamento Financeiro'),
      path: '/financial-planning',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: t('common.settings', 'Configurações'),
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogoutDialogOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserInitials = () => {
    const fullName = user ? (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário') : t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const userFullName = user ? (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário') : t('common.user', 'Usuário');

  return (
    <>
      <Sidebar variant="default" className="fixed h-screen w-64 transition-all duration-300 z-10 border-r border-gray-200 shadow-sm">
        <SidebarHeader className="my-[16px]">
          <div className="flex items-center p-4 justify-between">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-[16px]">
          <SidebarMenu>
            {navigationItems.map(item => {
              const isActive = isActiveRoute(item.path);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive} 
                    tooltip={state === 'collapsed' ? item.name : undefined}
                  >
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center rounded-md w-full transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary font-bold" 
                          : "text-text-primary hover:bg-gray-100"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center",
                        isActive ? "text-primary" : "text-text-primary"
                      )}>
                        {item.icon}
                      </span>
                      <span className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => setIsLogoutDialogOpen(true)} 
                className="text-red-500 hover:text-red-600" 
                tooltip={state === 'collapsed' ? t('auth.logout', 'Sair') : undefined}
              >
                <LogOut className="w-5 h-5" />
                <span className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                  {t('auth.logout', 'Sair')}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <Link to="/settings?tab=profile" className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
            <div className={`flex items-center ${state === 'collapsed' ? 'justify-center' : ''}`}>
              <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userFullName} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-white text-black">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                <p className="text-sm font-medium">{userFullName}</p>
              </div>
            </div>
          </Link>
        </SidebarFooter>
      </Sidebar>
      
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('auth.confirmLogout', 'Confirmar Saída')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('auth.logoutConfirmation', 'Tem certeza que deseja sair? Sua sessão será encerrada.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('common.cancel', 'Cancelar')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t('auth.logout', 'Sair')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SidebarNav;
