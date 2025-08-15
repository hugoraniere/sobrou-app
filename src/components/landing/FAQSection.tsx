import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
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
      answer: "Sim! O Sobrou funciona como PWA (Progressive Web App), permitindo uso offline. As informações sincronizam automaticamente quando você se conecta à internet."
    },
    {
      question: "Como a IA categoriza meus gastos?",
      answer: "Nossa IA analisa o texto da transação, histórico de compras e padrões de comportamento para categorizar automaticamente. Você pode ajustar e a IA aprende com suas preferências."
    },
    {
      question: "Qual a diferença entre as versões gratuita e paga?",
      answer: "A versão gratuita inclui recursos básicos de controle financeiro. A versão paga oferece insights avançados da IA, relatórios detalhados, integração WhatsApp ilimitada e suporte prioritário."
    },
    {
      question: "Posso importar dados de outros apps?",
      answer: "Sim, você pode importar extratos bancários em PDF, CSV ou Excel. Também oferecemos importação de dados de planilhas e outros aplicativos populares de finanças."
    },
    {
      question: "O app funciona para empresas também?",
      answer: "Sim! O Sobrou atende tanto pessoas físicas quanto empresas. Temos recursos específicos como a calculadora de restaurante e controle de múltiplas contas."
    },
    {
      question: "Como cancelar minha conta?",
      answer: "Você pode cancelar a qualquer momento nas configurações. Todos os seus dados podem ser exportados antes do cancelamento, e excluímos permanentemente suas informações conforme solicitado."
    }
  ];

  return (
    <section id="faq" className="w-full py-16 sm:py-20 lg:py-24 bg-card scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Tire suas dúvidas sobre o Sobrou e descubra como transformar seu controle financeiro
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border-subtle rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-montserrat font-semibold text-text-primary hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            Ainda tem dúvidas?
          </p>
          <a 
            href="#contato" 
            className="inline-flex items-center text-primary hover:text-primary-hover font-medium"
          >
            Entre em contato conosco →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;