
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-primary-light/50 to-white">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Organize suas finanças só digitando
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-8">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#como-funciona">
                <Button size="lg" variant="outline" className="font-alliance">
                  Ver como funciona
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-lg shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
                alt="Sobrou App Interface"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-lg transform translate-x-4 translate-y-4 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
