
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { Home, PlusCircle, Settings, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderMobileNavProps {
  isPublic?: boolean;
  onNewTransaction: () => void;
}

const HeaderMobileNav: React.FC<HeaderMobileNavProps> = ({ isPublic = false, onNewTransaction }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
                <Link to="/" className="flex items-center p-2 hover:bg-background-surface rounded" onClick={() => setIsMobileMenuOpen(false)}>
                  <Home className="mr-3 h-5 w-5" />
                  <span>{t('common.dashboard', 'Painel')}</span>
                </Link>
                
                <button 
                  className="flex items-center p-2 hover:bg-background-surface rounded w-full text-left"
                  onClick={() => {
                    onNewTransaction();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <PlusCircle className="mr-3 h-5 w-5" />
                  <span>{t('transactions.new', 'Nova Transação')}</span>
                </button>
                
                <Link to="/settings" className="flex items-center p-2 hover:bg-background-surface rounded" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="mr-3 h-5 w-5" />
                  <span>{t('common.settings', 'Configurações')}</span>
                </Link>
              </div>
              
              <div className="border-t border-border-subtle pt-4">
                <div className="p-2">
                  <LanguageSwitcher />
                </div>
                
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
              <div className="p-2">
                <LanguageSwitcher />
              </div>
              <Link to="/auth" className="flex items-center p-2 hover:bg-background-surface rounded" onClick={() => setIsMobileMenuOpen(false)}>
                {t('auth.login', 'Entrar')}
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderMobileNav;
