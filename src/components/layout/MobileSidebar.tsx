
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, FileText, Target, Settings, LogOut, TrendingUp, Calculator } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAvatar } from '@/contexts/AvatarContext';

const MobileSidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { avatarUrl } = useAvatar();
  
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
      name: t('financialPlanning.title', 'Planejamento'),
      path: '/financial-planning',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: 'Calculadora de Custos',
      path: '/restaurant-calculator',
      icon: <Calculator className="w-5 h-5" />,
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('common.menu', 'Menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] max-w-[90vw]">
        <div className="py-4">
          <div className="flex items-center mb-6 p-2">
            <Avatar className="h-10 w-10 bg-primary text-white mr-3">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="User" />
              ) : (
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              )}
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
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-gray-700"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-primary" : "text-gray-700"
                  )}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
            
            <Link
              to="/settings"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-100",
                isActiveRoute('/settings') ? "bg-primary/10 text-primary font-semibold" : "text-gray-700"
              )}
              onClick={() => setOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="ml-3">{t('common.settings', 'Configurações')}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-red-600 rounded-md hover:bg-gray-100"
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
