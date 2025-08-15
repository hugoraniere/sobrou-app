import React from 'react';
import { Brain, TrendingUp, AlertCircle, Target } from 'lucide-react';

const AutomationAISection: React.FC = () => {
  return (
    <section id="automacao-ia" className="w-full py-16 sm:py-20 lg:py-24 bg-card scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Inteligência Artificial a seu favor
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Deixe nossa IA trabalhar por você: insights automáticos, alertas inteligentes e sugestões personalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-2xl p-6 border border-border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Brain className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-text-primary">
                Insights Automáticos
              </h3>
            </div>
            <p className="text-text-secondary mb-4">
              Nossa IA analisa seus padrões de gastos e identifica oportunidades de economia, 
              tendências preocupantes e comportamentos financeiros.
            </p>
            <div className="bg-background-surface rounded-lg p-4">
              <p className="text-sm text-text-secondary italic">
                "Seus gastos com delivery aumentaram 30% este mês. Considere cozinhar mais em casa para economizar R$ 200."
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-text-primary">
                Alertas Inteligentes
              </h3>
            </div>
            <p className="text-text-secondary mb-4">
              Receba notificações proativas sobre gastos incomuns, metas em risco, 
              contas próximas do vencimento e oportunidades de economia.
            </p>
            <div className="bg-background-surface rounded-lg p-4">
              <p className="text-sm text-text-secondary italic">
                "⚠️ Você gastou 80% do orçamento de entretenimento em apenas 15 dias do mês."
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-text-primary">
                Previsões Financeiras
              </h3>
            </div>
            <p className="text-text-secondary mb-4">
              Simulações automáticas de cenários futuros baseados em seus padrões atuais. 
              Visualize o impacto de mudanças nos seus hábitos.
            </p>
            <div className="bg-background-surface rounded-lg p-4">
              <p className="text-sm text-text-secondary italic">
                "Mantendo este padrão, você economizará R$ 1.200 até o final do ano."
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Target className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-text-primary">
                Metas Adaptativas
              </h3>
            </div>
            <p className="text-text-secondary mb-4">
              Nossas metas se ajustam automaticamente baseadas no seu desempenho, 
              sugerindo valores realistas e estratégias personalizadas.
            </p>
            <div className="bg-background-surface rounded-lg p-4">
              <p className="text-sm text-text-secondary italic">
                "Baseado no seu histórico, sugerimos aumentar sua meta de economia para R$ 800/mês."
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Brain className="text-primary h-5 w-5" />
            <span className="text-primary font-medium">
              IA que aprende com você e evolui constantemente
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationAISection;