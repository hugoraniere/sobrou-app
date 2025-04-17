
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Target, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Organize suas finanças só digitando</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Sobrou ajuda você a rastrear despesas sem esforço - basta enviar uma mensagem e nós fazemos o resto.
            <span className="block mt-2 font-medium">100% Gratuito para usar.</span>
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
              Crie sua conta grátis
            </Button>
          </Link>
          <div className="flex items-center gap-2 justify-center mt-4">
            <CheckCircle2 className="text-green-500 h-5 w-5" />
            <span className="text-gray-700 font-medium">Simples. Rápido. Seguro.</span>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Como o Sobrou funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-xl font-semibold mb-2">Você digita</h3>
              <p className="text-gray-600">"Gastei R$ 50 com mercado ontem" via WhatsApp ou aplicativo web.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-xl font-semibold mb-2">A IA entende</h3>
              <p className="text-gray-600">Nossa IA processa o texto e categoriza automaticamente sua transação.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Tudo se organiza</h3>
              <p className="text-gray-600">Veja gráficos atualizados automaticamente e relatórios inteligentes.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/auth">
            <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
