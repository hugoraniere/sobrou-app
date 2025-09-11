
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from '../brand/Logo';

const TransparentHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center">
            <Logo size="sm" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 font-outfit text-sm">
            <Link to="#features" className="text-gray-700 hover:text-primary transition-colors">
              Funcionalidades
            </Link>
            <Link to="#como-funciona" className="text-gray-700 hover:text-primary transition-colors">
              Como funciona
            </Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary transition-colors">
              Preços
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="font-outfit text-sm text-gray-700 hover:text-primary">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button className="bg-primary hover:bg-primary-hover text-white font-outfit text-sm">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
