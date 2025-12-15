'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  questions: FAQItem[];
}

export function FAQSection({ questions }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-semibold pr-4">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-4 text-muted-foreground">{item.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
