import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="w-full py-16 sm:py-20 lg:py-24 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Texto / CTA */}
          <div className="flex flex-col justify-center mb-12 lg:mb-16">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Organize suas finanças,<br />
              é só digitar
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-8 w-full sm:w-auto">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#como-funciona">
                <Button size="lg" variant="outline" className="font-alliance w-full sm:w-auto">
                  Ver como funciona
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 justify-center text-gray-600">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
          </div>
          
          {/* Imagem */}
          <div className="relative flex justify-center w-full max-w-5xl">
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden w-full">
              <img
                src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
                alt="Dashboard do Sobrou mostrando controle financeiro completo"
                className="rounded-2xl w-full h-auto"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform translate-x-6 translate-y-6 -z-10 pointer-events-none hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
