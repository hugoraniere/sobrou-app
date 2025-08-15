import React from 'react';
import { FileText, Zap, Brain } from 'lucide-react';

const StatementImportSection: React.FC = () => {
  return (
    <section id="importacao-extratos" className="w-full py-16 sm:py-20 lg:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Interface de importação de extratos bancários"
              className="w-full h-auto rounded-2xl shadow-lg bg-background-surface"
            />
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -translate-x-4 -translate-y-4 -z-10 pointer-events-none hidden sm:block" />
          </div>

          <div>
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Importação inteligente de extratos
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Economize horas de trabalho manual. Importe extratos bancários e deixe nossa IA organizar tudo.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    Múltiplos Formatos
                  </h3>
                  <p className="text-text-secondary">
                    Suporte para PDF, CSV, Excel e outros formatos comuns de extratos bancários. 
                    Reconhecimento automático do layout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    Categorização Automática
                  </h3>
                  <p className="text-text-secondary">
                    Nossa IA analisa históricos e padrões para categorizar automaticamente 
                    suas transações com alta precisão.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    Processamento Rápido
                  </h3>
                  <p className="text-text-secondary">
                    Centenas de transações processadas em segundos. Revisão fácil e ajustes rápidos 
                    quando necessário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatementImportSection;