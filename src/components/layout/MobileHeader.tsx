
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MobileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-background-base sticky top-0 z-10">
      <Link to="/" className="flex items-center">
        <Logo size="sm" />
      </Link>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pt-10">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/dashboard" 
              className={cn(
                "py-2 px-3 rounded-md font-medium",
                isActivePath('/dashboard') 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              {t('common.dashboard', 'Painel')}
            </Link>
            
            <Link 
              to="/transactions" 
              className={cn(
                "py-2 px-3 rounded-md font-medium",
                isActivePath('/transactions') 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              {t('common.transactions', 'Transações')}
            </Link>
            
            <Link 
              to="/goals" 
              className={cn(
                "py-2 px-3 rounded-md font-medium",
                isActivePath('/goals') 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              {t('common.goals', 'Metas')}
            </Link>
            
            <Link 
              to="/financial-planning" 
              className={cn(
                "py-2 px-3 rounded-md font-medium",
                isActivePath('/financial-planning') 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              {t('financialPlanning.title', 'Planejamento')}
            </Link>
            
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link 
                to="/settings" 
                className="py-2 px-3 rounded-md font-medium hover:bg-gray-100 text-gray-700 block"
                onClick={() => setIsOpen(false)}
              >
                {t('common.settings', 'Configurações')}
              </Link>
              
              <button 
                className="py-2 px-3 rounded-md font-medium hover:bg-gray-100 text-red-600 w-full text-left mt-2"
                onClick={handleLogout}
              >
                {t('auth.logout', 'Sair')}
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileHeader;
