import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { PROCESS_STEPS } from '../../data/content';

export function ProcessSection() {
  return (
    <section id="process" className="section-padding relative">
      <div className="container-mx">
        <SectionHeading
          eyebrow="How It Works"
          title={<>A simple <span className="text-gradient-gold">4-step</span> workflow</>}
          subtitle="From raw footage to polished delivery — a clean, transparent process you'll always be part of."
        />

        <RevealScope className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 100} as="article">
              <div className="relative h-full">
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="absolute left-[3.25rem] top-9 -z-10 hidden h-px w-[calc(100%-3.25rem)] bg-gradient-to-r from-gold-500/40 to-transparent lg:block" />
                )}
                <div className="card-glass h-full p-7 hover:border-gold-500/30 hover:bg-white/[0.06]">
                  <div className="flex items-center gap-4">
                    <span className="grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-2xl border border-gold-500/30 bg-gold-500/[0.06] font-display text-xl font-bold text-gradient-gold">{step.step}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-gold-500/30 to-transparent" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealScope>
      </div>
    </section>
  );
}
