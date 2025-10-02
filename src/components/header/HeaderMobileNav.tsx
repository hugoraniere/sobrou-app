
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, PlusCircle, Settings, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface HeaderMobileNavProps {
  isPublic?: boolean;
  onNewTransaction: () => void;
}

const HeaderMobileNav: React.FC<HeaderMobileNavProps> = ({ isPublic = false, onNewTransaction }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
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

  // For TypeScript errors: Cast user to any temporarily to allow access to user_metadata
  const userAny = user as any;

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col space-y-4 pt-8">
          {userAny && !isPublic ? (
            <>
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-10 w-10 bg-primary text-white">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {userAny.user_metadata?.full_name || t('common.user', 'Usuário')}
                </span>
              </div>
              
              <div className="border-t border-border-subtle pt-4">
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "flex items-center p-2 rounded",
                    isActivePath('/dashboard') 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-background-surface text-text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="mr-3 h-5 w-5" />
                  <span>{t('common.dashboard', 'Painel')}</span>
                </Link>
                
                <button 
                  className={cn(
                    "flex items-center p-2 rounded w-full text-left",
                    isActivePath('/transactions') 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-background-surface text-text-primary"
                  )}
                  onClick={() => {
                    onNewTransaction();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <PlusCircle className="mr-3 h-5 w-5" />
                  <span>{t('transactions.new', 'Nova Transação')}</span>
                </button>
                
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center p-2 rounded",
                    isActivePath('/settings') 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-background-surface text-text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>{t('common.settings', 'Configurações')}</span>
                </Link>
              </div>
              
              <div className="border-t border-border-subtle pt-4">
                <button 
                  className="flex items-center p-2 text-feedback-error hover:bg-background-surface rounded w-full text-left mt-2"
                  onClick={handleLogout}
                >
                  {t('auth.logout', 'Sair')}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/?auth=1&tab=signup" className="flex items-center p-2 hover:bg-background-surface rounded" onClick={() => setIsMobileMenuOpen(false)}>
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderMobileNav;
