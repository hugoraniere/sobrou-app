
import React from 'react';
import Header from '../components/Header';

const PublicLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Gerencie suas finanças com o Sobrou
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A maneira mais fácil de rastrear despesas, definir orçamentos e economizar dinheiro - diretamente do seu celular.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/auth" 
              className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Começar Agora
            </a>
            <a 
              href="/auth" 
              className="px-8 py-3 bg-white text-green-600 font-medium rounded-md border border-green-200 hover:bg-gray-50 transition-colors"
            >
              Saiba Mais
            </a>
          </div>
        </div>
        
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center mb-12">Como o Sobrou Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Conecte o WhatsApp</h3>
              <p className="text-gray-600">Vincule seu WhatsApp ao Sobrou para rastrear despesas facilmente em movimento.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Registre Despesas</h3>
              <p className="text-gray-600">Envie uma mensagem rápida sobre suas compras e nós as categorizaremos automaticamente.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Obtenha Insights</h3>
              <p className="text-gray-600">Veja relatórios de gastos personalizados e receba dicas para melhorar suas finanças.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
