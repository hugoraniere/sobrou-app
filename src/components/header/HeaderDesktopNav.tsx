
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { Home, PlusCircle, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderDesktopNavProps {
  onNewTransaction: () => void;
}

const HeaderDesktopNav: React.FC<HeaderDesktopNavProps> = ({ onNewTransaction }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  // For TypeScript errors: Cast user to any temporarily to allow access to user_metadata
  const userAny = user as any;

  return (
    <>
      <Menubar className="border-none shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            <span>{t('common.dashboard', 'Painel')}</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/" className="flex items-center w-full">
                <Home className="mr-2 h-4 w-4" />
                {t('common.dashboard', 'Painel')}
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer" onClick={onNewTransaction}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>{t('transactions.new', 'Nova Transação')}</span>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('common.settings', 'Configurações')}</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                {t('common.settings', 'Configurações')}
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleLogout}>
              {t('auth.logout', 'Sair')}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="flex items-center space-x-2 ml-4">
        <LanguageSwitcher />
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-primary text-white">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {userAny.user_metadata?.full_name || t('common.user', 'Usuário')}
          </span>
        </div>
      </div>
    </>
  );
};

export default HeaderDesktopNav;
