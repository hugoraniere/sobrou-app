
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, FileText, Target, Settings, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const MobileSidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  
  const getUserInitials = () => {
    const fullName = user && (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário');
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
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

  // Helper function to check if a route is active
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('common.menu', 'Menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] max-w-[90vw] z-[1100] bg-background-base">
        <div className="flex items-center p-4 border-b border-border-subtle">
          <img 
            src="/lovable-uploads/logo.png" 
            alt="Logo" 
            className="h-6 w-auto" 
          />
        </div>
        
        <div className="py-4 px-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex items-center mb-6 p-2">
            <Avatar className="h-10 w-10 bg-primary text-white mr-3">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {user && (user as any)?.user_metadata?.full_name || t('common.user', 'Usuário')}
              </p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-background-surface",
                    isActive 
                      ? "bg-background-surface text-primary font-bold" 
                      : "text-text-primary font-normal"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-primary" : "text-text-primary"
                  )}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-feedback-error rounded-md hover:bg-background-surface text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">{t('auth.logout', 'Sair')}</span>
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
