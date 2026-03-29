'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/constants';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left side — heading */}
        <div className="lg:col-span-2 lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
            Got Questions?
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked<br />Questions
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Everything you need to know about renting with EliteDrive4U. Can&apos;t find your answer? Get in touch with our team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors"
          >
            <FaQuestionCircle />
            Contact our team
          </a>
        </div>

        {/* Right side — accordion */}
        <div className="lg:col-span-3">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white rounded-xl border border-gray-100 px-5 mb-2.5 shadow-sm"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/5 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-500 leading-relaxed pb-3 pl-10">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
