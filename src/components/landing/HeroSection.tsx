import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-[100svh] bg-green-50/30 scroll-mt-16 flex items-center overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Imagem absoluta para desktop */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] xl:w-[55vw] max-w-[1040px] pointer-events-none z-0 hidden lg:block">
          <div className="absolute inset-0 rounded-2xl bg-primary/5 translate-x-8 translate-y-8 -z-10" />
          <img
            src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
            alt="Dashboard do Sobrou mostrando controle financeiro completo"
            className="rounded-2xl shadow-2xl w-full h-auto"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="(min-width: 1024px) 55vw, 90vw"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Texto / CTA */}
          <div className="flex flex-col justify-center lg:pr-24 xl:pr-32">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Organize suas finanças,<br />
              é só digitar
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 text-gray-600">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
          </div>
          
          {/* Imagem responsiva para mobile/tablet */}
          <div className="mt-8 flex justify-center lg:hidden">
            <img
              src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
              alt="Dashboard do Sobrou mostrando controle financeiro completo"
              className="w-full max-w-md sm:max-w-lg rounded-2xl shadow-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
