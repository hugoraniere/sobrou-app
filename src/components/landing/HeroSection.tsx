import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
          {/* Texto / CTA */}
          <div className="text-center lg:text-left flex flex-col justify-center">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-2xl mx-auto lg:mx-0">
              Organize suas finanças só digitando
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            <div className="flex items-center gap-2 mt-6 justify-center lg:justify-start text-gray-600">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
          </div>
          
          {/* Imagem */}
          <div className="relative flex justify-center">
            <div className="relative z-10 rounded-lg shadow-2xl overflow-hidden max-w-lg w-full">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900"
                alt="Sobrou App Interface"
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-lg transform translate-x-4 translate-y-4 -z-10 pointer-events-none hidden sm:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
