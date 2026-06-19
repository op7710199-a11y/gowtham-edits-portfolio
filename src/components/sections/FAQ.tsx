import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { FaqItem } from '../../types/database';

interface Props { faqs: FaqItem[]; }

export function FAQ({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section-padding relative">
      <div className="container-mx">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions, <span className="text-gradient-gold">answered</span></>}
          subtitle="Everything you need to know before sending over footage."
        />
        <RevealScope className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.id} delay={i * 60}>
                  <div className={`glass overflow-hidden rounded-2xl transition-colors ${isOpen ? 'border-gold-500/30 bg-white/[0.05]' : ''}`}>
                    <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6">
                      <span className="font-display text-base font-semibold text-white sm:text-lg">{item.question}</span>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-180 border-gold-400 bg-gold-gradient text-ink-950' : 'border-white/10 text-stone-300'}`}>
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-cinematic ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-stone-300 sm:px-6 sm:pb-6">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </RevealScope>
        <Reveal className="mt-10 text-center">
          <p className="text-sm text-stone-400">Still unsure?{' '}<a href="#contact" className="font-medium text-gold-300 underline-offset-4 hover:underline">Drop me a message</a>{' '}— usually replies within a few hours.</p>
        </Reveal>
      </div>
    </section>
  );
}
