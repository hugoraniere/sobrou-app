
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeaderLogo from './header/HeaderLogo';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from './transactions/AddTransactionDialog';
import HeaderDesktopNav from './header/HeaderDesktopNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Header: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <header className="bg-background-base border-b border-border-subtle shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <HeaderLogo />
          
          <div className="flex items-center space-x-4">
            {!user && (
              <Link to="/?auth=1">
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded">
                  {t('auth.login', 'Entrar')}
                </button>
              </Link>
            )}
            
            {user && !isPublic && (
              <>
                {isMobile ? (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[80%] sm:max-w-sm">
                      <div className="mt-8 space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => {
                            setIsAddTransactionOpen(true);
                          }}
                        >
                          Nova Transação
                        </Button>
                        <nav className="space-y-2">
                          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Dashboard
                          </Link>
                          <Link to="/transactions" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Transações
                          </Link>
                          <Link to="/goals" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Metas
                          </Link>
                          <Link to="/financial-planning" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Planejamento
                          </Link>
                          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Configurações
                          </Link>
                          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                            Perfil
                          </Link>
                        </nav>
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <div className="hidden md:flex">
                    <HeaderDesktopNav onNewTransaction={() => setIsAddTransactionOpen(true)} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {user && !isPublic && (
        <AddTransactionDialog
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          onTransactionAdded={() => {}}
        />
      )}
    </>
  );
};

export default Header;
