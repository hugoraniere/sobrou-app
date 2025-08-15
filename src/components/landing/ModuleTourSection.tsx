import React from 'react';
import { BarChart3, Calendar, Receipt, Target, Calculator } from 'lucide-react';

const ModuleTourSection: React.FC = () => {
  const modules = [
    {
      icon: BarChart3,
      title: "Dashboard Inteligente",
      description: "Visão completa das suas finanças com gráficos interativos e insights personalizados.",
      image: "/placeholder.svg"
    },
    {
      icon: Receipt,
      title: "Gestão de Transações",
      description: "Cadastro por voz, texto ou WhatsApp. Importação de extratos bancários automática.",
      image: "/placeholder.svg"
    },
    {
      icon: Calendar,
      title: "Planejamento Mensal",
      description: "Organize seu orçamento, compare períodos e simule cenários financeiros.",
      image: "/placeholder.svg"
    },
    {
      icon: Target,
      title: "Metas de Economia",
      description: "Defina objetivos, acompanhe progresso e receba sugestões inteligentes de economia.",
      image: "/placeholder.svg"
    },
    {
      icon: Receipt,
      title: "Contas a Pagar",
      description: "Controle total sobre vencimentos, pagamentos e fluxo de caixa.",
      image: "/placeholder.svg"
    },
    {
      icon: Calculator,
      title: "Calculadora de Restaurante",
      description: "Ferramenta especializada para calcular custos de pratos e ingredientes.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section id="modulos" className="w-full py-16 sm:py-20 lg:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Módulos completos para seu negócio
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para gerenciar suas finanças pessoais ou empresariais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <module.icon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    {module.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {module.description}
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src={module.image}
                  alt={`Interface do módulo ${module.title}`}
                  className="w-full h-40 object-cover rounded-lg bg-background-surface"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModuleTourSection;