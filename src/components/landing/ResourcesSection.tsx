import React from 'react';
import { Smartphone, Brain, PieChart, Zap } from 'lucide-react';

const ResourcesSection: React.FC = () => {
  return (
    <section id="recursos" className="w-full bg-[#F8FAF7] py-16 sm:py-20 lg:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recursos que facilitam sua vida
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-alliance-n2 text-xl mb-3">Use no WhatsApp</h3>
            <p className="font-alliance text-gray-600 flex-1">
              Registre seus gastos direto pelo WhatsApp. Simples, rápido e prático.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Brain className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-alliance-n2 text-xl mb-3">IA que entende você</h3>
            <p className="font-alliance text-gray-600 flex-1">
              Nossa IA entende sua linguagem natural e organiza tudo automaticamente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-alliance-n2 text-xl mb-3">Gráficos intuitivos</h3>
            <p className="font-alliance text-gray-600 flex-1">
              Visualize seus gastos e ganhos de forma clara e objetiva.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-alliance-n2 text-xl mb-3">Rápido e fácil</h3>
            <p className="font-alliance text-gray-600 flex-1">
              Comece em menos de 2 minutos. Sem complicação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
