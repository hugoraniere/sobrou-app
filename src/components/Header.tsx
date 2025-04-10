
import React from 'react';
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, PlusCircle, Settings } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  isPublic?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isPublic = false }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={isAuthenticated ? "/" : "/auth"} className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl">FinanceBot</span>
        </Link>
        
        {isAuthenticated ? (
          // Logged-in user navigation
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/" className="font-medium hover:text-blue-500 transition-colors flex items-center gap-1">
              <Home size={16} />
              {t('header.dashboard')}
            </Link>
            <Link to="/" className="font-medium hover:text-blue-500 transition-colors flex items-center gap-1">
              <PlusCircle size={16} />
              {t('header.addExpense')}
            </Link>
            <Link to="/settings" className="font-medium hover:text-blue-500 transition-colors flex items-center gap-1">
              <Settings size={16} />
              {t('header.settings')}
            </Link>
            <Link to="/integration" className="font-medium hover:text-blue-500 transition-colors">
              {t('header.whatsappSetup')}
            </Link>
          </nav>
        ) : (
          // Public navigation
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/auth" className="font-medium hover:text-blue-500 transition-colors">Home</Link>
          </nav>
        )}
        
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                {user?.fullName || 'User'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('header.logout')}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
