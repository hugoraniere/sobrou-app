import React from 'react';
import { MessageSquare, Brain, PieChart, Smartphone, FileText, Target } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full py-16 sm:py-20 lg:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Controle financeiro simples e inteligente
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">Digite naturalmente</h3>
            <p className="text-text-secondary flex-1">
              "Gastei R$ 50 com mercado ontem" ou envie por WhatsApp - Simples assim.
            </p>
          </div>

          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">IA organiza tudo</h3>
            <p className="text-text-secondary flex-1">
              Nossa IA entende e categoriza automaticamente suas transações com insights inteligentes.
            </p>
          </div>

          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PieChart className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">Visualize e planeje</h3>
            <p className="text-text-secondary flex-1">
              Dashboards intuitivos, planejamento mensal e metas de economia personalizadas.
            </p>
          </div>

          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">WhatsApp e Voz</h3>
            <p className="text-text-secondary flex-1">
              Registre gastos por WhatsApp ou comando de voz. PWA para usar como app nativo.
            </p>
          </div>

          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">Importação automática</h3>
            <p className="text-text-secondary flex-1">
              Importe extratos bancários em segundos. Suporte para PDF, CSV e Excel.
            </p>
          </div>

          <div className="bg-card text-center p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-3">Metas e alertas</h3>
            <p className="text-text-secondary flex-1">
              Defina metas, receba alertas inteligentes e sugestões personalizadas de economia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
