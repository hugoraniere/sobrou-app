
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Settings, 
  LogOut, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const SidebarNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const { state, toggleSidebar } = useSidebar();

  const getUserInitials = () => {
    // Type assertion to access user_metadata
    const fullName = user && (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogoutDialogOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigationItems = [
    {
      name: t('common.dashboard', 'Visão Geral'),
      path: '/',
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
      name: t('common.settings', 'Configurações'),
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const userFullName = user && (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário');

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center p-4 justify-between">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-green-500 mr-2" />
              <span className={`text-xl font-bold text-gray-900 transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Sobrou</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="h-8 w-8"
            >
              {state === 'expanded' ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                  tooltip={state === 'collapsed' ? item.name : undefined}
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    <span className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {/* Logout Button */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => setIsLogoutDialogOpen(true)}
                className="text-red-500 hover:text-red-600"
                tooltip={state === 'collapsed' ? t('auth.logout', 'Sair') : undefined}
              >
                <LogOut className="w-5 h-5" />
                <span className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('auth.logout', 'Sair')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className={`p-4 border-t border-gray-200 ${state === 'collapsed' ? 'flex justify-center' : ''}`}>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 bg-blue-500 text-white">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className={`ml-3 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                <p className="text-sm font-medium">{userFullName}</p>
              </div>
            </div>
          </div>
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
