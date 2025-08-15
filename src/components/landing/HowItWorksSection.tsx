import React from 'react';
import { MessageSquare, Brain, BarChart3 } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="como-funciona" className="w-full py-16 sm:py-20 lg:py-24 bg-card scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Como funciona o Sobrou
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Três passos simples para revolucionar seu controle financeiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary h-10 w-10" />
              </div>
              <span className="absolute -top-2 -left-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">
              Digite naturalmente
            </h3>
            <p className="text-text-secondary">
              "Gastei R$ 50 com mercado ontem" ou envie por WhatsApp. Nossa IA entende sua linguagem natural.
            </p>
          </div>

          <div className="text-center">
            <div className="relative mb-6">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-primary h-10 w-10" />
              </div>
              <span className="absolute -top-2 -left-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">
              IA organiza automaticamente
            </h3>
            <p className="text-text-secondary">
              Categorização inteligente, detecção de padrões e organização automática de todas suas transações.
            </p>
          </div>

          <div className="text-center">
            <div className="relative mb-6">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-primary h-10 w-10" />
              </div>
              <span className="absolute -top-2 -left-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">
              Visualize e planeje
            </h3>
            <p className="text-text-secondary">
              Dashboards intuitivos, relatórios detalhados e planejamento financeiro personalizado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;