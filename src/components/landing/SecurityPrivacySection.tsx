import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const SecurityPrivacySection: React.FC = () => {
  return (
    <section id="seguranca-privacidade" className="w-full py-16 sm:py-20 lg:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Seus dados protegidos e privados
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Segurança bancária e privacidade total. Seus dados financeiros ficam apenas com você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-3">
              Criptografia Total
            </h3>
            <p className="text-text-secondary text-sm">
              Todos os dados são criptografados com padrão bancário AES-256. Suas informações ficam totalmente protegidas.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-3">
              Acesso Seguro
            </h3>
            <p className="text-text-secondary text-sm">
              Autenticação multifator, sessões seguras e controle total sobre quem acessa suas informações.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-3">
              Privacidade por Design
            </h3>
            <p className="text-text-secondary text-sm">
              Não vendemos nem compartilhamos seus dados. Você tem controle total sobre suas informações pessoais.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Server className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold text-text-primary mb-3">
              Infraestrutura Confiável
            </h3>
            <p className="text-text-secondary text-sm">
              Hospedagem em servidores seguros, backup automático e alta disponibilidade garantida.
            </p>
          </div>
        </div>

        <div className="bg-background-surface rounded-2xl p-8 text-center">
          <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-4">
            Compromisso com a Transparência
          </h3>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Você pode exportar, 
            editar ou excluir todos os seus dados a qualquer momento. Nossa política de privacidade 
            é clara e acessível, sem letras miúdas ou armadilhas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;