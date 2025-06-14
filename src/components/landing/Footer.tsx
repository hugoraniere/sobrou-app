import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F8FAF7] py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-alliance-n2 font-bold text-gray-900">Sobrou</h3>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 font-alliance justify-center md:justify-end">
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
