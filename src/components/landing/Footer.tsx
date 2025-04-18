
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8FAF7] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-alliance-n2 font-bold text-gray-900">Sobrou</h3>
          </div>
          <div className="flex flex-wrap gap-6 text-gray-600 font-alliance">
            <a href="#" className="hover:text-primary transition-colors">Sobre</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
