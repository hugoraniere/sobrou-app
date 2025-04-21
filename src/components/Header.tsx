
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeaderLogo from './header/HeaderLogo';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from './transactions/AddTransactionDialog';
import HeaderDesktopNav from './header/HeaderDesktopNav';

const Header: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = React.useState(false);

  return (
    <>
      <header className="bg-background-base border-b border-border-subtle shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <HeaderLogo />
          
          <div className="flex items-center space-x-4">
            {!user && (
              <Link to="/auth">
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded">
                  {t('auth.login', 'Entrar')}
                </button>
              </Link>
            )}
            
            {user && !isPublic && (
              <div className="hidden md:flex">
                <HeaderDesktopNav onNewTransaction={() => setIsAddTransactionOpen(true)} />
              </div>
            )}
          </div>
        </div>
      </header>

      {user && !isPublic && (
        <AddTransactionDialog
          isOpen={isAddTransactionOpen}
          setIsOpen={setIsAddTransactionOpen}
          onTransactionAdded={() => {
            /* Removido o recarregamento da página */
          }}
        />
      )}
    </>
  );
};

export default Header;
