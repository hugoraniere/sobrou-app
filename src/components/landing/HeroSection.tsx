import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Shield, Smartphone } from 'lucide-react';
import { getSectionContainer } from '@/constants/layoutTokens';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="w-full h-[90vh] py-12 bg-green-50/30 overflow-x-visible flex items-center justify-center">
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-6">
        {/* Div 1 - Conteúdo */}
        <div className="flex flex-col justify-center items-center text-center lg:text-left lg:items-start">
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
            
            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
              <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="font-alliance text-sm text-gray-700">
                  Segurança dos seus dados em primeiro lugar
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <span className="font-alliance text-sm text-gray-700">
                  Acesse quando quiser, no celular ou computador
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Div 2 - Imagem */}
        <div className="h-full relative">
          <div className="h-full w-[150vw] absolute left-0 top-0">
            <img 
              src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png" 
              alt="Dashboard do Sobrou mostrando controle financeiro completo" 
              className="w-full h-full object-cover object-left shadow-2xl"
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