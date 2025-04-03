
import React from 'react';
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-trend-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-montserrat font-bold text-xl hidden md:inline-block">TrendMap AI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="font-medium hover:text-trend-blue transition-colors">Home</Link>
          <Link to="/categories" className="font-medium hover:text-trend-blue transition-colors">Categorias</Link>
          <Link to="/generator" className="font-medium hover:text-trend-blue transition-colors">Gerador de Conteúdo</Link>
          <Link to="/alerts" className="font-medium hover:text-trend-blue transition-colors">Alertas</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden sm:inline-flex">Entrar</Button>
          <Button className="bg-trend-blue hover:bg-trend-blue/90">Criar Conta</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
