
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import TrendCard from '../components/TrendCard';
import IdeasGenerator from '../components/IdeasGenerator';
import AIAssistant from '../components/AIAssistant';

// Dados mockados para fins de demonstração
const generateGrowthData = () => {
  const data = [];
  let value = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < 10; i++) {
    value = value + Math.floor(Math.random() * 15) - 2;
    value = Math.max(0, value);
    data.push({ value });
  }
  
  return data;
};

const mockTrends = [
  {
    id: 1,
    name: "Inteligência Artificial Generativa",
    growthData: generateGrowthData(),
    competition: "medium" as const,
    category: "Tecnologia"
  },
  {
    id: 2,
    name: "Sustentabilidade na Moda",
    growthData: generateGrowthData(),
    competition: "low" as const,
    category: "Moda",
    isHot: true
  },
  {
    id: 3,
    name: "Educação Híbrida",
    growthData: generateGrowthData(),
    competition: "high" as const,
    category: "Educação"
  },
  {
    id: 4,
    name: "Bem-estar Mental",
    growthData: generateGrowthData(),
    competition: "medium" as const,
    category: "Saúde",
    isHot: true
  },
  {
    id: 5,
    name: "Negócios Digitais",
    growthData: generateGrowthData(),
    competition: "high" as const,
    category: "Negócios"
  },
  {
    id: 6,
    name: "Design Generativo",
    growthData: generateGrowthData(),
    competition: "low" as const,
    category: "Criatividade",
    isHot: true
  },
  {
    id: 7,
    name: "Minimalismo Digital",
    growthData: generateGrowthData(),
    competition: "low" as const,
    category: "Lifestyle"
  },
  {
    id: 8,
    name: "Investimentos Sustentáveis",
    growthData: generateGrowthData(),
    competition: "medium" as const,
    category: "Finanças"
  }
];

// Dados mockados de ideias de conteúdo
const mockContentIdeas = [
  "10 ferramentas de IA que vão revolucionar seu workflow em 2025",
  "Como a moda sustentável está transformando o consumo consciente",
  "Estratégias para criar um ambiente de educação híbrida eficiente"
];

const mockAIPrompts = [
  "Crie uma imagem no estilo ilustrativo mostrando um profissional usando ferramentas de IA em seu trabalho",
  "Escreva um artigo de 800 palavras sobre como implementar práticas sustentáveis em uma marca de moda iniciante",
  "Crie um roteiro para um vídeo de 5 minutos sobre as tendências de educação híbrida em 2025"
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedTrend, setSelectedTrend] = useState<number | null>(null);
  const [filteredTrends, setFilteredTrends] = useState(mockTrends);
  
  // Filtrar tendências quando a categoria muda
  useEffect(() => {
    if (activeCategory === "Todos") {
      setFilteredTrends(mockTrends);
    } else {
      setFilteredTrends(mockTrends.filter(trend => trend.category === activeCategory));
    }
  }, [activeCategory]);
  
  // Selecionar uma tendência para mostrar ideias
  const handleSelectTrend = (id: number) => {
    setSelectedTrend(id === selectedTrend ? null : id);
  };
  
  // Encontrar a tendência selecionada
  const selectedTrendData = mockTrends.find(trend => trend.id === selectedTrend);
  
  return (
    <div className="min-h-screen flex flex-col bg-trend-gray-light/30">
      <Header />
      
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 pb-16">
          <div className="flex flex-col md:flex-row gap-6">
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            
            <div className="flex-1">
              {/* Alerta de oportunidade */}
              <div className="bg-white border border-trend-green p-4 rounded-lg mb-6 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-trend-green/10 flex items-center justify-center text-trend-green">
                  🚀
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg">Alerta de oportunidade!</h3>
                  <p className="text-sm text-trend-gray-dark">Detectamos trends em ascensão com baixa concorrência. Expanda seu público agora!</p>
                </div>
              </div>
              
              {/* Ideias de conteúdo para a trend selecionada */}
              {selectedTrendData && (
                <div className="mb-6">
                  <IdeasGenerator
                    trend={selectedTrendData.name}
                    contentIdeas={mockContentIdeas}
                    aiPrompts={mockAIPrompts}
                  />
                </div>
              )}
              
              {/* Grid de tendências */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrends.map((trend) => (
                  <TrendCard
                    key={trend.id}
                    name={trend.name}
                    growthData={trend.growthData}
                    competition={trend.competition}
                    isHot={trend.isHot}
                    onSelect={() => handleSelectTrend(trend.id)}
                  />
                ))}
              </div>
              
              {/* Mensagem caso não haja tendências na categoria */}
              {filteredTrends.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-trend-gray-dark">Nenhuma tendência encontrada nesta categoria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Assistente de IA */}
      <AIAssistant />
    </div>
  );
};

export default Index;
