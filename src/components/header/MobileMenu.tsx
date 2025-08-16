import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: '#features', label: 'Funcionalidades' },
    { to: '#como-funciona', label: 'Como funciona' },
    { to: '#pricing', label: 'Preços' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b">
            <span className="font-outfit font-semibold text-lg">Menu</span>
          </div>
          
          <nav className="flex flex-col space-y-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-lg font-outfit text-foreground hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t space-y-4">
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-outfit">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?tab=signup" onClick={() => setOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary-hover text-white font-outfit">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;