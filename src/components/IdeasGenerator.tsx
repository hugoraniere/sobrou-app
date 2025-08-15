
import React from 'react';
import { Lightbulb, Sparkles, Copy } from 'lucide-react';

type IdeasGeneratorProps = {
  trend: string;
  contentIdeas: string[];
  aiPrompts: string[];
};

const IdeasGenerator = ({ trend, contentIdeas, aiPrompts }: IdeasGeneratorProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Adicionar uma notificação de cópia aqui
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
      <h3 className="font-outfit font-semibold text-xl mb-6 flex items-center gap-2">
        <Lightbulb size={20} className="text-trend-orange" />
        <span>Ideias para: <span className="text-trend-blue">{trend}</span></span>
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-outfit font-medium text-lg mb-3">Sugestões de Conteúdo</h4>
          
          {contentIdeas.map((idea, index) => (
            <div key={index} className="ai-suggestion flex justify-between items-start gap-3">
              <div>
                <p className="text-sm font-medium">{idea}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(idea)}
                className="text-trend-gray-dark hover:text-trend-blue p-1 rounded-full"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-outfit font-medium text-lg mb-3 flex items-center gap-2">
            <span>Prompts para IA</span>
            <Sparkles size={16} className="text-trend-blue" />
          </h4>
          
          {aiPrompts.map((prompt, index) => (
            <div key={index} className="ai-suggestion flex justify-between items-start gap-3">
              <div>
                <p className="text-sm font-medium">{prompt}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(prompt)}
                className="text-trend-gray-dark hover:text-trend-blue p-1 rounded-full"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-trend-blue/10 flex items-center justify-center">
            <Sparkles size={16} className="text-trend-blue" />
          </div>
          <p className="text-sm text-trend-gray-dark italic">
            Estas ideias foram geradas por IA com base nas tendências atuais e métricas de engajamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeasGenerator;
