
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from '../brand/Logo';

const TransparentHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <Logo size="sm" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 font-alliance">
            <Link to="#features" className="text-gray-700 hover:text-primary transition-colors">
              Funcionalidades
            </Link>
            <Link to="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">
              Como funciona
            </Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary transition-colors">
              Preços
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="font-alliance text-gray-700 hover:text-primary">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button className="bg-primary hover:bg-primary-hover text-white font-alliance">
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
