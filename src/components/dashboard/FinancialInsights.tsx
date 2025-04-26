import React from 'react';
import { Transaction } from '@/services/transactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp, Lightbulb, DollarSign, Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { transactionCategories } from '@/data/categories';

interface FinancialInsightsProps {
  transactions: Transaction[];
}

interface InsightItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'warning' | 'info' | 'success' | 'tip';
  category?: string;
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ transactions }) => {
  const [showAllTips, setShowAllTips] = useState(false);
  
  const getInsights = (): InsightItem[] => {
    const insights: InsightItem[] = [];
    
    if (transactions.length === 0) {
      return [];
    }
    
    const categoryExpenses: Record<string, number> = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    currentMonthTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categoryExpenses[transaction.category] = (categoryExpenses[transaction.category] || 0) + transaction.amount;
      }
    });
    
    let highestExpenseCategory = '';
    let highestExpenseAmount = 0;
    
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      if (amount > highestExpenseAmount) {
        highestExpenseCategory = category;
        highestExpenseAmount = amount;
      }
    });
    
    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (highestExpenseCategory) {
      const categoryName = transactionCategories.find(c => c.id === highestExpenseCategory)?.name || highestExpenseCategory;
      const percentOfTotal = ((highestExpenseAmount / totalExpenses) * 100).toFixed(0);
      
      insights.push({
        id: 'highest-expense',
        title: `${categoryName} é sua maior despesa`,
        description: `${percentOfTotal}% dos seus gastos são com ${categoryName.toLowerCase()}. Considere reavaliar este gasto se quiser economizar.`,
        icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
        type: 'warning',
        category: highestExpenseCategory
      });
    }
    
    const monthlyBalance = totalIncome - totalExpenses;
    if (monthlyBalance < 0) {
      insights.push({
        id: 'negative-balance',
        title: 'Saldo negativo neste mês',
        description: `Você gastou R$${Math.abs(monthlyBalance).toFixed(2)} a mais do que ganhou. Considere reduzir gastos em categorias não essenciais.`,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        type: 'warning'
      });
    } else if (monthlyBalance > 0) {
      insights.push({
        id: 'positive-balance',
        title: 'Saldo positivo neste mês',
        description: `Parabéns! Você economizou R$${monthlyBalance.toFixed(2)}. Considere investir este valor ou adicionar à sua reserva de emergência.`,
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        type: 'success'
      });
    }
    
    const savingTips: Record<string, string[]> = {
      food: [
        "Faça uma lista antes de ir ao supermercado e siga-a rigorosamente.",
        "Prepare refeições em casa e leve marmita para o trabalho.",
        "Aproveite promoções e compre em quantidade itens não perecíveis.",
        "Compare preços entre diferentes mercados."
      ],
      housing: [
        "Desligue aparelhos eletrônicos que não estão em uso.",
        "Troque lâmpadas por modelos mais econômicos (LED).",
        "Reduza o tempo de banho para economizar água e energia.",
        "Considere renegociar o aluguel ou buscar um imóvel mais acessível."
      ],
      transportation: [
        "Utilize transporte público sempre que possível.",
        "Considere caronas compartilhadas para o trabalho.",
        "Mantenha seu veículo em dia para evitar consumo excessivo de combustível.",
        "Planeje rotas para otimizar o uso do carro."
      ],
      entertainment: [
        "Procure por eventos gratuitos em sua cidade.",
        "Compartilhe assinaturas de streaming com familiares.",
        "Estabeleça um orçamento fixo mensal para lazer.",
        "Troque refeições em restaurantes caros por opções mais econômicas."
      ],
      health: [
        "Compare preços de medicamentos em diferentes farmácias.",
        "Verifique programas de desconto oferecidos por laboratórios.",
        "Invista em medicina preventiva para evitar custos maiores no futuro.",
        "Considere planos de saúde com melhor custo-benefício."
      ]
    };
    
    if (highestExpenseCategory && savingTips[highestExpenseCategory]) {
      const categoryTips = savingTips[highestExpenseCategory];
      const categoryName = transactionCategories.find(c => c.id === highestExpenseCategory)?.name || highestExpenseCategory;
      
      categoryTips.forEach((tip, index) => {
        insights.push({
          id: `${highestExpenseCategory}-tip-${index}`,
          title: `Dica para economizar em ${categoryName}`,
          description: tip,
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
          type: 'tip',
          category: highestExpenseCategory
        });
      });
    }
    
    const generalTips = [
      "Estabeleça um orçamento mensal e siga-o rigorosamente.",
      "Use a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para economias.",
      "Cancele assinaturas e serviços que você não usa com frequência.",
      "Renegocie dívidas com taxas de juros mais altas.",
      "Crie uma reserva de emergência equivalente a 3-6 meses de despesas.",
      "Automatize suas economias com transferências programadas no dia do pagamento.",
      "Estabeleça metas financeiras claras e específicas.",
      "Evite compras por impulso - espere 24 horas antes de comprar itens não essenciais."
    ];
    
    generalTips.forEach((tip, index) => {
      insights.push({
        id: `general-tip-${index}`,
        title: "Dica financeira",
        description: tip,
        icon: <DollarSign className="h-5 w-5 text-blue-500" />,
        type: 'tip'
      });
    });
    
    insights.push({
      id: 'saving-goal-tip',
      title: "Estabeleça metas de economia",
      description: "Definir metas específicas aumenta suas chances de economizar. Crie uma meta para cada objetivo financeiro importante.",
      icon: <Target className="h-5 w-5 text-purple-500" />,
      type: 'info'
    });
    
    return insights;
  };
  
  const insights = getInsights();
  const warnings = insights.filter(insight => insight.type === 'warning' || insight.type === 'success');
  const tips = insights.filter(insight => insight.type === 'tip' || insight.type === 'info');
  
  const displayedTips = showAllTips ? tips : tips.slice(0, 3);
  
  const renderIcon = (insight: InsightItem) => {
    return insight.icon;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Insights Financeiros</h2>
      
      {insights.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Adicione mais transações para receber insights personalizados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Alertas e Destaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warnings.map((insight) => (
                <Card key={insight.id} className={`shadow-sm border-l-4 ${
                  insight.type === 'warning' ? 'border-l-red-500' : 'border-l-green-500'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {renderIcon(insight)}
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dicas de Economia</h3>
            <div className="grid grid-cols-1 gap-4">
              {displayedTips.map((insight) => (
                <Card key={insight.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {renderIcon(insight)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left no-underline hover:no-underline">
                            {insight.title}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{insight.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              {!showAllTips && tips.length > 3 && (
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllTips(true)}
                  >
                    Ver mais {tips.length - 3} dicas
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialInsights;
