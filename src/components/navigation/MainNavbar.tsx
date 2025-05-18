
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '../brand/Logo';
import AddTransactionDialog from '../transactions/AddTransactionDialog';

const MainNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserInitials = () => {
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
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-background-base border-b border-border-subtle shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActivePath('/dashboard') ? "text-primary" : "text-gray-700"
                )}
              >
                {t('common.dashboard', 'Painel')}
              </Link>
              
              <Link 
                to="/transactions" 
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActivePath('/transactions') ? "text-primary" : "text-gray-700"
                )}
              >
                {t('common.transactions', 'Transações')}
              </Link>
              
              <Link 
                to="/goals" 
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActivePath('/goals') ? "text-primary" : "text-gray-700"
                )}
              >
                {t('common.goals', 'Metas')}
              </Link>
              
              <Link 
                to="/financial-planning" 
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActivePath('/financial-planning') ? "text-primary" : "text-gray-700"
                )}
              >
                {t('financialPlanning.title', 'Planejamento')}
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center">
          {!user && (
            <Link to="/auth">
              <Button variant="primary" size="sm">
                {t('auth.login', 'Entrar')}
              </Button>
            </Link>
          )}
          
          {user && (
            <div className="flex items-center">
              <Button 
                variant="ghost"
                size="sm"
                className="mr-4 hidden md:flex"
                onClick={() => setIsAddTransactionOpen(true)}
              >
                {t('transactions.new', 'Nova Transação')}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarFallback className="bg-primary text-primary-foreground">
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
                    <Link to="/settings">
                      {t('common.settings', 'Configurações')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    {t('auth.logout', 'Sair')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      
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
