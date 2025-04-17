
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/hooks/use-i18n';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Settings, 
  Globe, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
  const { changeLanguage, isCurrentLanguage } = useI18n();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || t('common.user', 'Usuário');
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

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center p-4">
            <Wallet className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">Sobrou</span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {/* Language Switcher */}
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton as="button" className="w-full text-left">
                    <Globe className="w-5 h-5" />
                    <span className="ml-3">{t('common.language', 'Alterar Idioma')}</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    className={cn(isCurrentLanguage('en') && "bg-accent")}
                    onClick={() => changeLanguage('en')}
                  >
                    <span className="mr-2">🇺🇸</span> English
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn(isCurrentLanguage('pt-BR') && "bg-accent")}
                    onClick={() => changeLanguage('pt-BR')}
                  >
                    <span className="mr-2">🇧🇷</span> Português
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            
            {/* Logout Button */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                as="button" 
                onClick={() => setIsLogoutDialogOpen(true)}
                className="text-red-500 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">{t('auth.logout', 'Sair')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 bg-blue-500 text-white">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.full_name || t('common.user', 'Usuário')}
                </p>
                <Link to="/profile" className="text-xs text-blue-500 hover:underline">
                  {t('common.viewProfile', 'Ver perfil')}
                </Link>
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
