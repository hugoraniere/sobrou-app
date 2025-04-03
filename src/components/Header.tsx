
import React from 'react';
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl">FinanceBot</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="font-medium hover:text-blue-500 transition-colors">Dashboard</Link>
          <Link to="/expenses" className="font-medium hover:text-blue-500 transition-colors">Expenses</Link>
          <Link to="/settings" className="font-medium hover:text-blue-500 transition-colors">Settings</Link>
          <Link to="/integration" className="font-medium hover:text-blue-500 transition-colors">WhatsApp Setup</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            WhatsApp Connected
          </Button>
          <Button size="sm">Login</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
