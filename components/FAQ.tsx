import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Import shadcn/ui Accordion components
import { faqs } from '@/constants';

// Define the type for a single FAQ item
type FAQItem = {
  id: string; // shadcn/ui Accordion requires `string` IDs
  question: string;
  answer: string;
};


const FAQ = () => {
  return (
    <section className="mx-auto px-4 py-12">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        Frequently Asked Questions
      </h2>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className='bg-white'>
              <AccordionTrigger className="text-left text-black">
                <h3 className="text-lg font-bold text-primary">
                  {faq.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[16px] text-black my-5 p-3">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;