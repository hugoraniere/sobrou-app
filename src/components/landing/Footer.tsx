import React from 'react';
import Logo from '../brand/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Logo size="sm" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 font-alliance justify-center md:justify-end">
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
