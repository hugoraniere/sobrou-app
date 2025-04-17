
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, Settings, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from './transactions/AddTransactionDialog';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNewTransaction = () => {
    setIsAddTransactionOpen(true);
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
  // This is a workaround and should be fixed by properly typing the user object
  const userAny = user as any;

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/076c0413-0b42-4810-b32c-5b627b744797.png" 
                alt="Sobrou Logo" 
                className="h-8 w-auto mr-2" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userAny && !isPublic ? (
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
                    <MenubarTrigger className="cursor-pointer" onClick={handleNewTransaction}>
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
                    <Avatar className="h-8 w-8 bg-blue-500 text-white">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {userAny.user_metadata?.full_name || t('common.user', 'Usuário')}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Link to="/auth">
                  <Button variant="outline" size="sm">{t('auth.login', 'Entrar')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
                        <Avatar className="h-10 w-10 bg-blue-500 text-white">
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {userAny.user_metadata?.full_name || t('common.user', 'Usuário')}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <Link to="/" className="flex items-center p-2 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                          <Home className="mr-3 h-5 w-5" />
                          <span>{t('common.dashboard', 'Painel')}</span>
                        </Link>
                        
                        <button 
                          className="flex items-center p-2 hover:bg-gray-100 rounded w-full text-left"
                          onClick={() => {
                            handleNewTransaction();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <PlusCircle className="mr-3 h-5 w-5" />
                          <span>{t('transactions.new', 'Nova Transação')}</span>
                        </button>
                        
                        <Link to="/settings" className="flex items-center p-2 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                          <Settings className="mr-3 h-5 w-5" />
                          <span>{t('common.settings', 'Configurações')}</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="p-2">
                          <LanguageSwitcher />
                        </div>
                        
                        <button 
                          className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded w-full text-left mt-2"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
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
                      <Link to="/auth" className="flex items-center p-2 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('auth.login', 'Entrar')}
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        setIsOpen={setIsAddTransactionOpen}
        onTransactionAdded={() => {
          if (window.location.pathname === '/') {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export default Header;
