
import React from 'react';
import { MessageSquare, Brain, PieChart } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
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
  );
};

export default FeaturesSection;
