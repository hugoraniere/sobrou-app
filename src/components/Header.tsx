
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderLogo from './header/HeaderLogo';
import HeaderDesktopNav from './header/HeaderDesktopNav';
import HeaderMobileNav from './header/HeaderMobileNav';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from './transactions/AddTransactionDialog';

const Header: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = React.useState(false);

  const handleNewTransaction = () => {
    setIsAddTransactionOpen(true);
  };

  return (
    <>
      <header className="bg-background-base border-b border-border-subtle shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <HeaderLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && !isPublic ? (
              <HeaderDesktopNav onNewTransaction={handleNewTransaction} />
            ) : (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Link to="/auth">
                  <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded">
                    {t('auth.login', 'Entrar')}
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <HeaderMobileNav 
              isPublic={isPublic} 
              onNewTransaction={handleNewTransaction} 
            />
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
