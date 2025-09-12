import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQEntry } from '@/types/support';

interface FAQAccordionProps {
  faqs: FAQEntry[];
  className?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs, className = "" }) => {
  if (faqs.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-text-secondary">Nenhuma pergunta frequente encontrada.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className={`w-full ${className}`}>
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left text-text-primary hover:text-primary">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: faq.answer_md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }} 
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;