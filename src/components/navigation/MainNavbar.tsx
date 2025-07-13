import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/brand/Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import { useAvatar } from '@/contexts/AvatarContext';
import MobileNavigation from './MobileNavigation';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
const MainNavbar: React.FC = () => {
  const {
    t
  } = useTranslation();
  const {
    user,
    logout
  } = useAuth();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const {
    avatarUrl
  } = useAvatar();
  const {
    isMobile
  } = useResponsive();
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
  return <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background-base border-b border-border-subtle shadow-sm h-16">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        
        {/* Left side: Logo */}
        <div className="flex items-center space-x-3">
          <Link to={user ? "/" : "/"} className="flex items-center">
            <Logo className="h-7" size="sm" />
          </Link>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-2">
          {!user && <Link to="/auth">
              <Button variant="default" size="sm" className="rounded-full">
                {t('auth.login', 'Entrar')}
              </Button>
            </Link>}
          
          {user && <>
              {/* Add Transaction - Both mobile and desktop */}
              

              {/* Mobile menu - positioned on the right */}
              {isMobile && <MobileNavigation />}
              
              {/* User Menu - Hidden on mobile since it's in the side menu */}
              {!isMobile && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        {avatarUrl ? <AvatarImage src={avatarUrl} alt="User" /> : <AvatarFallback className="bg-gray-100 text-black">
                            {getUserInitials()}
                          </AvatarFallback>}
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
                </DropdownMenu>}
            </>}
        </div>
      </div>

      {/* Dialog para nova transação */}
      {user && <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} onTransactionAdded={() => {}} />}
    </header>;
};
export default MainNavbar;