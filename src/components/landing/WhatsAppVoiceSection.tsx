import React from 'react';
import { MessageCircle, Mic, Smartphone } from 'lucide-react';

const WhatsAppVoiceSection: React.FC = () => {
  return (
    <section id="whatsapp-voz" className="w-full py-16 sm:py-20 lg:py-24 bg-card scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Registre gastos por WhatsApp e voz
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              A forma mais rápida e natural de controlar suas finanças. Sem complicação, sem perder tempo.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    WhatsApp Integrado
                  </h3>
                  <p className="text-text-secondary">
                    Envie mensagens diretamente pelo WhatsApp: "Gastei 80 reais com combustível". 
                    Nossa IA processa e categoriza automaticamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mic className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    Comando de Voz
                  </h3>
                  <p className="text-text-secondary">
                    Grave áudios no app ou WhatsApp. Transcrição automática e processamento inteligente 
                    de múltiplas transações em uma única gravação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-2">
                    PWA Mobile
                  </h3>
                  <p className="text-text-secondary">
                    Instale como app nativo no seu celular. Funciona offline e sincroniza quando conectar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Interface do WhatsApp e comandos de voz do Sobrou"
              className="w-full h-auto rounded-2xl shadow-lg bg-background-surface"
            />
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform translate-x-4 translate-y-4 -z-10 pointer-events-none hidden sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppVoiceSection;