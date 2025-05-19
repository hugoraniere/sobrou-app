
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/brand/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';

const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserInitials = () => {
    // Cast to any to access user_metadata which isn't in the UserProfile type
    const userAny = user as any;
    if (!userAny?.user_metadata?.full_name) return 'U';
    const names = userAny.user_metadata.full_name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <header className="relative w-full bg-background-base border-b border-border-subtle shadow-sm px-2 py-2">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo com tamanho reduzido */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-7" size="sm" />
          </Link>
        </div>

        {/* Ações à direita com avatar maior */}
        <div className="flex items-center">
          {!user && (
            <Link to="/auth">
              <Button variant="default" size="sm" className="rounded-full">
                {t('auth.login', 'Entrar')}
              </Button>
            </Link>
          )}
          
          {user && (
            <div className="flex items-center">
              <Button 
                variant="default"
                size="sm"
                className="mr-4 hidden md:flex rounded-full bg-primary text-white hover:bg-primary-hover"
                onClick={() => setIsAddTransactionOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('transactions.new', 'Nova Transação')}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarFallback className="bg-gray-100 text-black">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2 text-sm font-medium">
                    {(user as any)?.user_metadata?.full_name || t('common.user', 'Usuário')}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('common.settings', 'Configurações')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout', 'Sair')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Nav centralizada com tamanho reduzido */}
      {user && (
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className={cn(
              "text-xs font-medium transition-colors hover:text-primary",
              isActivePath('/dashboard') ? "text-primary" : "text-gray-700"
            )}
          >
            {t('common.dashboard', 'Painel')}
          </Link>
          <Link 
            to="/transactions" 
            className={cn(
              "text-xs font-medium transition-colors hover:text-primary",
              isActivePath('/transactions') ? "text-primary" : "text-gray-700"
            )}
          >
            {t('common.transactions', 'Transações')}
          </Link>
          <Link 
            to="/goals" 
            className={cn(
              "text-xs font-medium transition-colors hover:text-primary",
              isActivePath('/goals') ? "text-primary" : "text-gray-700"
            )}
          >
            {t('common.goals', 'Metas')}
          </Link>
          <Link 
            to="/financial-planning" 
            className={cn(
              "text-xs font-medium transition-colors hover:text-primary",
              isActivePath('/financial-planning') ? "text-primary" : "text-gray-700"
            )}
          >
            {t('financialPlanning.title', 'Planejamento')}
          </Link>
          <Link 
            to="/restaurant-calculator" 
            className={cn(
              "text-xs font-medium transition-colors hover:text-primary",
              isActivePath('/restaurant-calculator') ? "text-primary" : "text-gray-700"
            )}
          >
            {'Calculadora de Custos'}
          </Link>
        </nav>
      )}

      {/* Dialog para nova transação */}
      {user && (
        <AddTransactionDialog
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          onTransactionAdded={() => {}}
        />
      )}
    </header>
  );
};

export default MainNavbar;
