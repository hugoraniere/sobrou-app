import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getSectionContainer } from '@/constants/layoutTokens';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="w-full h-screen py-16 sm:py-20 lg:py-24 bg-green-50/30 overflow-hidden">
      <div className={`${getSectionContainer()} h-full`}>
        <div className="h-full grid grid-cols-1 lg:grid-cols-2">
          {/* Div 1 - Conteúdo */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <h1 className="font-alliance-n2 text-4xl lg:text-[3.21515625rem] font-semibold leading-[1.3] mb-6 md:text-5xl">
                Organize suas finanças,<br />
                <span className="text-primary">é só digitar</span>
              </h1>
              <p className="font-alliance text-gray-600 mb-8 text-lg font-light">
                Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-6 text-gray-600 justify-center lg:justify-start">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-alliance">Comece em menos de 2 minutos</span>
              </div>
            </div>
          </div>

          {/* Div 2 - Imagem */}
          <div className="flex items-center justify-start overflow-hidden">
            <img 
              src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png" 
              alt="Dashboard do Sobrou mostrando controle financeiro completo" 
              className="w-full lg:w-auto h-auto lg:h-[80%] object-contain object-left shadow-2xl rounded-l-2xl lg:rounded-l-none transform lg:translate-x-[10%]" 
              loading="eager" 
              fetchPriority="high" 
              decoding="async" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;