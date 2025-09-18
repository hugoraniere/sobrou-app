import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLandingPage } from '@/contexts/LandingPageContext';

const FAQSection: React.FC = () => {
  const { getConfig } = useLandingPage();
  const faqConfig = getConfig('faq');

  // Fallback data em caso de não carregar a configuração
  const config = faqConfig?.content || {
    title: "Perguntas frequentes",
    subtitle: "Tire suas dúvidas sobre nossa plataforma",
    questions: [
      {
        question: "Como funciona a integração com WhatsApp?",
        answer: "Você conecta seu número de WhatsApp nas configurações e pode enviar mensagens como 'Gastei R$ 50 com mercado' diretamente para nosso bot. A IA processa automaticamente e categoriza a transação."
      },
      {
        question: "Meus dados bancários ficam seguros?",
        answer: "Sim, usamos criptografia de nível bancário (AES-256) e seguimos rigorosamente a LGPD. Não temos acesso às suas contas bancárias - você importa apenas extratos que escolher compartilhar."
      },
      {
        question: "Posso usar offline?",
        answer: "Algumas funções básicas funcionam offline, mas para sincronização e análises com IA é necessária conexão com internet. Seus dados ficam salvos localmente quando offline."
      },
      {
        question: "Como a IA categoriza meus gastos?",
        answer: "Nossa IA analisa o texto da sua transação e identifica automaticamente a categoria mais apropriada. Ela aprende com seus padrões e fica mais precisa com o tempo. Você sempre pode corrigir e ela aprende com isso."
      },
      {
        question: "Posso conectar múltiplas contas bancárias?",
        answer: "Sim, você pode importar extratos de quantas contas quiser. O sistema organiza tudo automaticamente e você pode filtrar por conta específica quando necessário."
      },
      {
        question: "Há limite de transações?",
        answer: "No plano gratuito você pode adicionar até 100 transações por mês. Nos planos pagos não há limite de transações."
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (faqConfig && !faqConfig.is_visible) {
    return null;
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {config.questions.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;