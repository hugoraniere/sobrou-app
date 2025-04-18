
import React from 'react';
import TransparentHeader from '../components/header/TransparentHeader';
import HeroSection from '../components/landing/HeroSection';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Smartphone, MessageSquare, PieChart, Zap, Brain } from 'lucide-react';

const PublicLanding: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TransparentHeader />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Como Funciona */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-alliance-n2 text-3xl md:text-4xl font-bold mb-4">
              Controle financeiro simples e inteligente
            </h2>
            <p className="font-alliance text-gray-600 max-w-2xl mx-auto text-lg">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary h-8 w-8" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">Digite naturalmente</h3>
              <p className="font-alliance text-gray-600">
                "Gastei R$ 50 com mercado ontem" - Simples assim.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-primary h-8 w-8" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">IA organiza tudo</h3>
              <p className="font-alliance text-gray-600">
                Nossa IA entende e categoriza automaticamente suas transações.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="text-primary h-8 w-8" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">Visualize seus gastos</h3>
              <p className="font-alliance text-gray-600">
                Gráficos e relatórios claros e intuitivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="bg-[#F8FAF7] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-alliance-n2 text-3xl md:text-4xl font-bold mb-4">
              Recursos que facilitam sua vida
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">Use no WhatsApp</h3>
              <p className="font-alliance text-gray-600">
                Registre seus gastos direto pelo WhatsApp. Simples, rápido e prático.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">IA que entende você</h3>
              <p className="font-alliance text-gray-600">
                Nossa IA entende sua linguagem natural e organiza tudo automaticamente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">Gráficos intuitivos</h3>
              <p className="font-alliance text-gray-600">
                Visualize seus gastos e ganhos de forma clara e objetiva.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-alliance-n2 text-xl mb-3">Rápido e fácil</h3>
              <p className="font-alliance text-gray-600">
                Comece em menos de 2 minutos. Sem complicação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-alliance-n2 text-3xl md:text-4xl font-bold mb-6">
            Comece agora mesmo
          </h2>
          <p className="font-alliance text-xl mb-8 opacity-90">
            Controle suas finanças de forma simples e inteligente
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-alliance-n2">
              Criar conta gratuita
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/90">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-alliance">Comece em menos de 2 minutos</span>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default PublicLanding;
