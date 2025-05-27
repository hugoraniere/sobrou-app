
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  LayoutDashboard, 
  FileText, 
  Target, 
  TrendingUp, 
  Calculator, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAvatar } from '@/contexts/AvatarContext';

const MobileNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { avatarUrl } = useAvatar();

  const getUserInitials = () => {
    const userAny = user as any;
    if (!userAny?.user_metadata?.full_name) return 'U';
    const names = userAny.user_metadata.full_name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Transações',
      url: '/transactions',
      icon: FileText,
    },
    {
      title: 'Metas',
      url: '/goals',
      icon: Target,
    },
    {
      title: 'Planejamento',
      url: '/financial-planning',
      icon: TrendingUp,
    },
    {
      title: 'Calculadora de Custos',
      url: '/restaurant-calculator',
      icon: Calculator,
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] max-w-[90vw] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="User" />
                ) : (
                  <AvatarFallback className="bg-primary text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {(user as any)?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = isActivePath(item.url);
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium text-sm">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-2">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all duration-200",
                  isActivePath('/settings')
                    ? "bg-primary text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span className="font-medium text-sm">Configurações</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
