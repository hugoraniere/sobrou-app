import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSafeAuth } from '@/hooks/useSafeAuth';

interface HeaderAuthButtonsProps {
  isMobile?: boolean;
  variant?: 'default' | 'support';
}

const HeaderAuthButtons: React.FC<HeaderAuthButtonsProps> = ({ 
  isMobile = false, 
  variant = 'default' 
}) => {
  const { user, logout } = useSafeAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary-hover text-white font-outfit text-sm">
            Ir para o app
          </Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={() => logout()}
          className="font-outfit text-sm"
        >
          Sair
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <Link to={variant === 'support' ? "/?auth=1&redirect=/suporte" : "/?tab=signup"}>
        <Button className="bg-primary hover:bg-primary-hover text-white font-outfit text-sm">
          {variant === 'support' ? 'Entrar' : 'Entrar/Cadastrar'}
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to={variant === 'support' ? "/?auth=1&redirect=/suporte" : "/?auth=1"}>
        <Button variant="ghost" className="font-outfit text-sm text-gray-700 hover:text-primary">
          Entrar
        </Button>
      </Link>
      <Link to="/?tab=signup">
        <Button className="bg-primary hover:bg-primary-hover text-white font-outfit text-sm">
          Criar conta grátis
        </Button>
      </Link>
    </div>
  );
};

export default HeaderAuthButtons;