
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Avatar flutuante */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-trend-blue text-white shadow-lg flex items-center justify-center hover:bg-trend-blue/90 transition-colors"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Assistente expandido */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl border border-border overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96'}`}>
          {/* Cabeçalho */}
          <div className="bg-trend-blue text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-medium">Assistente TrendMap</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-1 hover:bg-white/20 rounded"
              >
                {isMinimized ? "+" : "-"}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/20 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Corpo do assistente */}
          {!isMinimized && (
            <>
              <div className="p-4 h-72 overflow-y-auto">
                <div className="mb-4">
                  <div className="bg-trend-gray-light p-3 rounded-lg rounded-tl-none inline-block max-w-[85%]">
                    <p className="text-sm">Olá! Estou monitorando as tendências para você. Em que posso ajudar hoje?</p>
                  </div>
                </div>
                
                <div className="mb-4 text-right">
                  <div className="bg-trend-blue/10 p-3 rounded-lg rounded-tr-none inline-block max-w-[85%]">
                    <p className="text-sm">Preciso de ideias para conteúdo sobre IA</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="bg-trend-gray-light p-3 rounded-lg rounded-tl-none inline-block max-w-[85%]">
                    <p className="text-sm">Analisando tendências sobre IA... 
                      <span className="inline-block w-full h-1 bg-trend-blue/20 mt-2 overflow-hidden rounded-full">
                        <span className="block w-2 h-full bg-trend-blue rounded-full animate-scanning"></span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Digite sua pergunta..."
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:border-trend-blue"
                  />
                  <button className="bg-trend-blue text-white p-2 rounded-md hover:bg-trend-blue/90">
                    Enviar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
