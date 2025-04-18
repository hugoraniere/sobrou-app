
import React from 'react';
import { Smartphone, Brain, PieChart, Zap } from 'lucide-react';

const ResourcesSection: React.FC = () => {
  return (
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
  );
};

export default ResourcesSection;
