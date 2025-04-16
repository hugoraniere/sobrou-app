
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const Header: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <Wallet className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">Sobrou</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {user && !isPublic ? (
            <div className="flex items-center space-x-4">
              <Link to="/integration">
                <Button variant="outline" size="sm">WhatsApp</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
